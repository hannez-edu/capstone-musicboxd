package org.musicboxd.security;

import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final JwtConverter converter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    // @bk: Inject UserDetailsService and new separated PasswordEncoder
    public SecurityConfig(JwtConverter converter,
                          UserDetailsService userDetailsService,
                          PasswordEncoder passwordEncoder) {
        this.converter = converter;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
        http.cors();

        http.authorizeRequests()
                .antMatchers("/api/user/authenticate").permitAll()
                .antMatchers("/api/user/register").permitAll()
                .antMatchers("/api/user/*").permitAll()
                .antMatchers("/api/reviews").permitAll()
                .antMatchers("/api/reviews/**").permitAll()
                .antMatchers("/api/albums").permitAll()
                .antMatchers("/api/albums/**").permitAll()
                .antMatchers("/api/catalog/**").permitAll()
                .antMatchers("/api/user/delete/*").hasRole("ADMIN")
                .antMatchers("/api/user/update/*").hasRole("ADMIN")
                .antMatchers("/api/albums/delete/*").hasRole("ADMIN")
                .anyRequest().authenticated()
                .and()
                .addFilter(new JwtRequestFilter(authenticationManager(), converter))
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder);
    }

    @Override
    @Bean
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    // @bk: Removed getEncoder method and moved to PasswordEncoderConfig
    // @bk: Removed corsConfigurer method and moved to WebMvcConfig
}