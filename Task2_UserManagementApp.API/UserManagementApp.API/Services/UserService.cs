using UserManagementApp.API.DTOs;
using UserManagementApp.API.Models;
using UserManagementApp.API.Repositories;

namespace UserManagementApp.API.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository) {
            _userRepository = userRepository;
        }
        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return users.Select(u => MapToResponseDto(u));
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return user == null ? null : MapToResponseDto(user);
        }

        public async Task<UserResponseDto> CreateUserAsync(UserCreateDto userDto)
        {
            var existingUser = await _userRepository.GetByEmailAsync(userDto.Email);
            if (existingUser != null) throw new Exception("Email already exists.");

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = userDto.FullName,
                Email = userDto.Email,
                Password = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            return MapToResponseDto(user);
        }
        public async Task<bool> UpdateUserAsync(Guid id, UserCreateDto userDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            user.FullName = userDto.FullName;
            user.Email = userDto.Email;
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return false;

            await _userRepository.DeleteAsync(user);
            return true;
        }
        private UserResponseDto MapToResponseDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
