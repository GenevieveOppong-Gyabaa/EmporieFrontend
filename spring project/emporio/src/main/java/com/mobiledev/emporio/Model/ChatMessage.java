package com.mobiledev.emporio.Model;

public class ChatMessage {
    private String sender;
    private String receiver;
    private String content;
    private String timeStamp;
    private String messageType; 
    private String imageUrl;

public ChatMessage(){
}
public ChatMessage(String sender, String receiver, String content, String timeStamp, String messageType, String imageUrl){
    this.sender=sender;
    this.receiver=receiver;
    this.content=content;
    this.timeStamp=timeStamp;
    this.messageType = messageType;
    this.imageUrl = imageUrl;
}
public String getSender(){
    return sender;
}
public void setSender(String sender){
    this.sender=sender;
}

public String getReceiver() {
     return receiver;
}
public void setReceiver(String receiver) { 
    this.receiver = receiver; 
}
public String getContent(){
    return content;
}
public void setContent(String content){
    this.content=content;
}
public String getTimeStamp(){
    return timeStamp;
}
public void setTimestamp(String timeStamp){
    this.timeStamp=timeStamp;
}
public String getMessageType() {
    return messageType; 
}
public void setMessageType(String messageType) {
    this.messageType = messageType; 
}
   public String getImageUrl() {
    return imageUrl; 
}
    public void setImageUrl(String imageUrl) {
    this.imageUrl = imageUrl; 
}

}
