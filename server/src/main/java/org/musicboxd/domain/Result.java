package org.musicboxd.domain;

import java.util.ArrayList;

public class Result<T> {
    private final ArrayList<String> messages = new ArrayList<>();
    private ResultType type = ResultType.SUCCESS;
    private T payload;

    public ArrayList<String> getMessages() {
        return messages;
    }

    public void addMessage(String message, ResultType type) {
        messages.add(message);
        this.type = type;
    }

    public ResultType getType() {
        return type;
    }

    public void setType(ResultType type) {
        this.type = type;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
