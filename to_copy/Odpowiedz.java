package com.sample;

public class Odpowiedz{
    public String pytanie;
    public String odpowiedz;

    public String getPytanie() {
        return pytanie;
    }

    public String getOdpowiedz() {
        return odpowiedz;
    }

    public void setOdpowiedz(String odpowiedz) {
        this.odpowiedz = odpowiedz;
    }

    public Odpowiedz() {
    }

    public Odpowiedz(String pytanie, String odpowiedz) {
        this.pytanie = pytanie;
        this.odpowiedz = odpowiedz;
    }
}