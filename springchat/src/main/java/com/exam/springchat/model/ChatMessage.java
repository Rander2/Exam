package com.exam.springchat.model;
import com.exam.springchat.entities.MessageEntity;
import com.exam.springchat.services.MessageService;
import com.exam.springchat.utils.InitiateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;
    private Integer id;

    public ChatMessage(MessageType type, String content, String sender) {

        this.type = type;
        this.content = content;
        this.sender = sender;
        if (this.type == MessageType.CHAT){


            MessageEntity messageEntity = new MessageEntity();
            messageEntity.setSender(this.sender);

            messageEntity.setText(this.content);
            InitiateUtils.saveM(messageEntity);
            this.id=messageEntity.getId();
            System.out.println("Chat message: "+this.id + "");
            if (this.content.equals("GETM"))
            {
                InitiateUtils.getM();
            }
            }

        }


    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}