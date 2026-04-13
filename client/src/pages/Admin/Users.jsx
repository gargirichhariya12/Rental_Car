import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ShieldCheck, UserRound, Wrench } from 'lucide-react';
import { TableSkeleton } from '../../components/Skeleton';

const roleMeta = {
  admin: { icon: <ShieldCheck size={14} />, className: 'bg-indigo-500/10 text-indigo-400' },
  owner: { icon: <Wrench size={14} />, className: 'bg-emerald-500/10 text-emerald-400' },
  user: { icon: <UserRound size={14} />, className: 'bg-gray-700 text-gray-300' },
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/admin/users');
        setUsers(data.data.users || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      setUpdatingId(userId);
      const { data } = await axios.patch('/api/admin/update-role', { userId, role });

      setUsers((currentUsers) => currentUsers.map((user) => (
        user._id === userId ? data.data.user : user
      )));

      toast.success('User role updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <TableSkeleton rows={6} />;
  }

  return (
    <div>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>User Management</h1>
        <p className='text-gray-400'>Review platform users and update their roles.</p>
      </div>

      <div className='overflow-hidden rounded-3xl border border-gray-800 bg-gray-900'>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-left text-sm'>
            <thead className='bg-gray-950/70 text-gray-400 uppercase text-xs tracking-wider'>
              <tr>
                <th className='px-6 py-4'>User</th>
                <th className='px-6 py-4'>Email</th>
                <th className='px-6 py-4'>Role</th>
                <th className='px-6 py-4'>Created</th>
                <th className='px-6 py-4'>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const currentRole = roleMeta[user.role] || roleMeta.user;

                return (
                  <tr key={user._id} className='border-t border-gray-800 text-gray-200'>
                    <td className='px-6 py-4 font-medium'>{user.name}</td>
                    <td className='px-6 py-4 text-gray-400'>{user.email}</td>
                    <td className='px-6 py-4'>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${currentRole.className}`}>
                        {currentRole.icon}
                        {user.role}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-gray-400'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4'>
                      <select
                        value={user.role}
                        disabled={updatingId === user._id}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className='rounded-xl border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-60'
                      >
                        <option value='user'>user</option>
                        <option value='owner'>owner</option>
                        <option value='admin'>admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
