package com.locket.config;

import com.locket.repository.UserRepository;
import com.locket.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WebSocketHandshakeHandler extends DefaultHandshakeHandler {

    private final JwtTokenProvider tokenProvider;
    private final UserDetailsService userDetailsService;
    private final UserRepository userRepository;

    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        // Lấy token từ query parameter hoặc header
        String authToken = request.getURI().getQuery();
        if (authToken != null && authToken.startsWith("token=")) {
            authToken = authToken.substring(6);
        } else {
            // Thử lấy từ headers nếu không có trong query
            String authHeader = request.getHeaders().getFirst("Authorization");
            if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
                authToken = authHeader.substring(7);
            } else {
                return null;
            }
        }

        if (StringUtils.hasText(authToken) && tokenProvider.validateToken(authToken)) {
            String email = tokenProvider.getEmailFromToken(authToken);
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

                System.out.println("HandshakeHandler: Setting Principal with userId=" + userId + ", email=" + email);
                return principal;
            }
        }

        return null;
    }
}

