import * as userRepository from '../../repositories/userRepository.js';

export async function queryUsers({ search, status, roleId }) {
  let list = await userRepository.getAll();
  
  if (search) {
    const searchLower = search.toLowerCase();
    list = list.filter(u => 
      u.name.toLowerCase().includes(searchLower) || 
      u.email.toLowerCase().includes(searchLower)
    );
  }
  if (status) {
    list = list.filter(u => u.status === status);
  }
  if (roleId) {
    list = list.filter(u => u.roleId === parseInt(roleId));
  }
  
  return list;
}

export async function createUser({ name, email, roleId }) {
  if (!name || !email) {
    throw { statusCode: 400, message: 'Name and email are required' };
  }
  
  const allUsers = await userRepository.getAll();
  const newId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: newId,
    name,
    email,
    roleId: roleId ? parseInt(roleId) : null,
    status: 'active'
  };
  
  return await userRepository.add(newUser);
}

export async function updateUser(id, updates) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return await userRepository.update(id, updates);
}

export async function activateUser(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return await userRepository.update(id, { status: 'active' });
}

export async function deactivateUser(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return await userRepository.update(id, { status: 'inactive' });
}

export async function deleteUser(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  return await userRepository.deleteById(id);
}

export async function resetPassword(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw { statusCode: 404, message: 'User not found' };
  }
  // Reset to default password hash (bcrypt of 'password')
  const defaultHash = '$2b$10$uX6brpGjFZCHXBuHEuIh7eK932Cl8JzSQTkZ25evFOUijK3iaEF0C';
  return await userRepository.updatePasswordHash(id, defaultHash);
}
