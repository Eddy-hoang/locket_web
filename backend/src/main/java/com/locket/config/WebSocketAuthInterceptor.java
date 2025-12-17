package com.locket.config;

import com.locket.repository.UserRepository;
import com.locket.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Principal;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        
        if (accessor != null) {
            StompCommand command = accessor.getCommand();
            System.out.println("WebSocket interceptor: command=" + command);
            
            if (StompCommand.CONNECT.equals(command)) {
                String authToken = accessor.getFirstNativeHeader("Authorization");
                
                if (StringUtils.hasText(authToken) && authToken.startsWith("Bearer ")) {
                    String token = authToken.substring(7);
                    
                    if (tokenProvider.validateToken(token)) {
                        String email = tokenProvider.getEmailFromToken(token);
                        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                        
                        // Lấy userId từ email
                        Long userId = userRepository.findByEmail(email)
                                .map(user -> user.getUserId())
                                .orElse(null);
                        
                        if (userId != null) {
                            // Tạo Principal với userId (string) thay vì email
                            Principal principal = new Principal() {
                                @Override
                                public String getName() {
                                    return userId.toString(); // Trả về userId thay vì email
                                }
                            };
                            
                            // Set authentication với Principal mới
                            UsernamePasswordAuthenticationToken authentication = 
                                new UsernamePasswordAuthenticationToken(
                                    principal,
                                    null,
                                    userDetails.getAuthorities()
                                );
                            
                            accessor.setUser(authentication);
                            
                            System.out.println("WebSocket authenticated: userId=" + userId + ", email=" + email);
                        }
                    }
                }
            } else if (StompCommand.SUBSCRIBE.equals(command)) {
                // Log subscription để debug
                String destination = accessor.getDestination();
                Principal user = accessor.getUser();
                System.out.println("WebSocket SUBSCRIBE: destination=" + destination + ", user=" + (user != null ? user.getName() : "null"));
                
                // Nếu user chưa được set, thử lấy từ session
                if (user == null) {
                    System.out.println("WARNING: SUBSCRIBE without Principal - subscription may not work!");
                } else {
                    System.out.println("SUBSCRIBE authenticated with userId: " + user.getName());
                }
            }
        }
        
        return message;
    }
}

