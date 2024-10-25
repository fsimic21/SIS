package com.sis.demo.controller;

import com.sis.demo.model.RequestLog;
import com.sis.demo.service.RequestLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("api/requests")
public class RequestLogController {

    @Autowired
    private RequestLogService requestLogService;

    @GetMapping("/")
    public List<RequestLog> getAllLogs() {
        try {
            return requestLogService.getAllRequestLogs();
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException("Error fetching request logs: " + e.getMessage());
        }
    }
}
