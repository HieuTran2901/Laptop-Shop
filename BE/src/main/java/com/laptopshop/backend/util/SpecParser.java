package com.laptopshop.backend.util;

import java.util.LinkedHashMap;
import java.util.Map;

public class SpecParser {

    public static Map<String, String> parse(String specs) {
        Map<String, String> map = new LinkedHashMap<>();

        if (specs == null || specs.isBlank()) return map;

        for (String line : specs.split("\\r?\\n")) {
            if (line.contains(":")) {
                String[] parts = line.split(":", 2);
                map.put(parts[0].trim(), parts[1].trim());
            }
        }
        return map;
    }

    public static String normalize(String specs) {
        return specs
                .replace("\r\n","\n")
                .replace("\r", "\n")
                .trim();
    }
}

