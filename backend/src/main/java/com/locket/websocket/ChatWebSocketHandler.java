package com.locket.websocket;

import com.locket.dto.request.SendMessageRequest;
import com.locket.dto.websocket.ChatMessageRequest;
import com.locket.dto.websocket.TypingNotificationRequest;
import com.locket.dto.response.MessageResponse;
import com.locket.model.Message;
        import com.locket.repository.UserRepository;
import com.locket.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserRepository userRepository;

    @MessageMapping("/chat.send")
    public void send(ChatMessageRequest req, Principal principal) {
        System.out.println("=== WebSocket Message Received ===");
        System.out.println("Principal: " + principal.getName());
        System.out.println("ReceiverId: " + req.getReceiverId());
        System.out.println("Content: " + req.getContent());

        // Principal.getName() bây giờ trả về userId (string)
        Long senderId = Long.parseLong(principal.getName());
        
        // Lấy email từ userId để gọi messageService
        String email = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getEmail();

        SendMessageRequest sendReq = new SendMessageRequest();
        sendReq.setReceiverId(req.getReceiverId());
        sendReq.setContent(req.getContent());
        sendReq.setMessageType(req.getMessageType());
        sendReq.setRefPhotoId(req.getRefPhotoId());

        MessageResponse saved = messageService.sendMessage(
                email,
                sendReq
        );

        System.out.println("Message saved with ID: " + saved.getMessageId());
        System.out.println("SenderId: " + senderId);
        System.out.println("ReceiverId: " + req.getReceiverId());

        // Gửi cho người nhận - sử dụng convertAndSend với destination trực tiếp
        // Vì convertAndSendToUser có thể không match subscription đúng cách
        String receiverDestination = "/user/" + req.getReceiverId() + "/queue/messages";
        System.out.println("Sending to receiver: " + receiverDestination);
        System.out.println("Message payload: " + saved.toString());
        try {
            messagingTemplate.convertAndSend(receiverDestination, saved);
            System.out.println("Successfully sent to receiver");
        } catch (Exception e) {
            System.out.println("Error sending to receiver: " + e.getMessage());
            e.printStackTrace();
        }

        // Gửi lại cho chính người gửi để UI cập nhật
        String senderDestination = "/user/" + senderId + "/queue/messages";
        System.out.println("Sending to sender: " + senderDestination);
        try {
            messagingTemplate.convertAndSend(senderDestination, saved);
            System.out.println("Successfully sent to sender");
        } catch (Exception e) {
            System.out.println("Error sending to sender: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=== Message sent ===");
    }



    @MessageMapping("/chat.typing")
    public void typing(TypingNotificationRequest req, Principal principal) {

        messagingTemplate.convertAndSendToUser(
                req.getReceiverId().toString(),
                "/queue/typing",
                Map.of(
                        "from", principal.getName(),
                        "typing", req.isTyping()
                )
        );
    }
}
