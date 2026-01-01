package com.matehub.xyspring.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.matehub.xyspring.domain.user.User;
import com.matehub.xyspring.mapper.LoginMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private LoginMapper loginMapper;

    public String login(User user) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("nick_name", user.getNickName());
        queryWrapper.eq("password", user.getPassword());
        User one = loginMapper.selectOne(queryWrapper);
        if (one != null) {
            return "ok";
        }
        return "false";
    }

    public String register(User user) {
        // Check if user already exists
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("nick_name", user.getNickName());
        User existingUser = loginMapper.selectOne(queryWrapper);
        
        if (existingUser != null) {
            return "exists";
        }

        int result = loginMapper.insert(user);

        if (result >= 1) {
            return "ok";
        }

        return "false";
    }
}
