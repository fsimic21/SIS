package com.sis.demo.controller;

import com.sis.demo.dto.OibDto;
import com.sis.demo.service.OibMockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/oib")
public class OibMockController {
    @Autowired
    OibMockService service;

     @PostMapping("/check")
    public ResponseEntity<Boolean> checkOib(@RequestBody OibDto oibDto){
         try{
            return ResponseEntity.ok(service.checkOibExistence(oibDto.getOib()));
         } catch (Exception e) {
             System.out.println(e);
             return ResponseEntity.ok(true);
         }
     }
}
