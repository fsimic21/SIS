package com.sis.demo.util;

import com.sis.demo.model.RequestLog;
import com.sis.demo.service.RequestLogService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    RequestLogService requestLogService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String requestPath = request.getServletPath();
        RequestLog log = new RequestLog();
        log.setPath(requestPath);
        log.setTimestamp(Instant.now());
        log.setRequestType(request.getMethod());

        if (
                requestPath.equals("/auth/login") || requestPath.equals("/auth/register")
        ) {
            log.setEmail("Ne autoriziran");
            requestLogService.addRequestLog(log);
            chain.doFilter(request, response);
            log.setResponse(response.getStatus());
            return;
        }

        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwtToken = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);

            try {
                username = jwtUtil.extractUsername(jwtToken);
            } catch (Exception e) {
                System.out.println("Greška prilikom vađenja korisničkog imena iz JWT-a: " + e.getMessage());
            }
        }
        log.setEmail(username);
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            if (jwtUtil.validateToken(jwtToken, username)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, null);
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Nevalidan JWT token.");
                log.setResponse(response.getStatus());
                requestLogService.addRequestLog(log);
                return;
            }
        }

        chain.doFilter(request, response);
        log.setResponse(response.getStatus());
        requestLogService.addRequestLog(log);
    }
}


