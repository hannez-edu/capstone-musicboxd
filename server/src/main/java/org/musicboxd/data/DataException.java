package org.musicboxd.data;

public class DataException extends Exception {
    public DataException(String message) {
        super(message);
    }

    public DataException(Throwable throwable) {
        super(throwable);
    }

    public DataException(String message, Throwable throwable) {
        super(message, throwable);
    }
}