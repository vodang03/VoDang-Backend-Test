using UserManagementApp.API.DTOs;

namespace UserManagementApp.API.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(Guid id);
        Task<UserResponseDto> CreateUserAsync(UserCreateDto userDto);
        Task<bool> UpdateUserAsync(Guid id, UserCreateDto userDto);
        Task<bool> DeleteUserAsync(Guid id);
    }
}
