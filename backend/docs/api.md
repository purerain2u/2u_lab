# API 문서

## 인증

### 로그인
- URL: `/api/login`
- 메소드: POST
- 요청 본문:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- 응답:
  ```json
  {
    "success": true,
    "message": "로그인 성공",
    "token": "JWT_TOKEN",
    "userId": "USER_ID"
  }
  ```

### 회원가입
- URL: `/api/signup`
- 메소드: POST
- 요청 본문:
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "newPassword123!"
  }
  ```
- 응답:
  ```json
  {
    "success": true,
    "message": "회원가입이 완료되었습니다."
  }
  ```

## 사용자

### 사용자 정보 조회
- URL: `/api/users/{id}`
- 메소드: GET
- 헤더: Authorization: Bearer JWT_TOKEN
- 응답:
  ```json
  {
    "id": "USER_ID",
    "username": "username",
    "email": "user@example.com"
  }
  ```

### 사용자 정보 수정
- URL: `/api/users/{id}`
- 메소드: PUT
- 헤더: Authorization: Bearer JWT_TOKEN
- 요청 본문:
  ```json
  {
    "name": "New Name",
    "email": "newemail@example.com"
  }
  ```
- 응답:
  ```json
  {
    "id": "USER_ID",
    "username": "New Name",
    "email": "newemail@example.com"
  }
  ```