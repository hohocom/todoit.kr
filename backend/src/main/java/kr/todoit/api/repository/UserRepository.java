package kr.todoit.api.repository;

import kr.todoit.api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    User findUserById(Long id);

    User findByEmailAndProvider(String email, String provider);
}
