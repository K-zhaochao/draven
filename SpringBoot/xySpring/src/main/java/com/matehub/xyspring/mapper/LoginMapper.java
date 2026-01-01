package com.matehub.xyspring.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.matehub.xyspring.domain.user.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginMapper extends BaseMapper<User> {

}
