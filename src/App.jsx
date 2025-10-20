import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Calendar, Users, Lock, LogOut, Eye, EyeOff, X, Settings } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export default function PointsTracker() {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [eventType, setEventType] = useState('meeting');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  const tierThresholds = {
    bronze: { points: 12, award: '$250' },
    silver: { points: 22, award: '$500' },
    gold: { points: 35, award: '$1000' }
  };

  const getTier = (points) => {
    if (points >= tierThresholds.gold.points) return { name: 'Gold', color: 'bg-yellow-500', award: '$1000' };
    if (points >= tierThresholds.silver.points) return { name: 'Silver', color: 'bg-gray-400', award: '$500' };
    if (points >= tierThresholds.bronze.points) return { name: 'Bronze', color: 'bg-amber-700', award: '$250' };
    return { name: 'None', color: 'bg-gray-300', award: '$0' };
  };

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to load student data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsAdmin(true);
        setLoginError('');
        setUsername('');
        setPassword('');
        setShowLoginModal(false);
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setUsername('');
    setPassword('');
  };

  const addStudent = async () => {
    if (!newStudentName.trim()) return;

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newStudentName.trim() })
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to add student');
        return;
      }

      await fetchStudents();
      setNewStudentName('');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  const addPoints = async () => {
    if (!selectedStudent) return;

    try {
      const response = await fetch(`${API_URL}/students/${selectedStudent}/points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType })
      });

      if (!response.ok) throw new Error('Failed to add points');

      await fetchStudents();
    } catch (error) {
      console.error('Error adding points:', error);
      alert('Failed to add points. Please try again.');
    }
  };

  const removeStudent = async (id) => {
    if (!window.confirm('Are you sure you want to remove this student?')) return;

    try {
      const response = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove student');

      await fetchStudents();
      if (selectedStudent === id) setSelectedStudent(null);
    } catch (error) {
      console.error('Error removing student:', error);
      alert('Failed to remove student. Please try again.');
    }
  };

  const resetPoints = async () => {
    if (!window.confirm('Reset all points for the new academic year (July 1st)? This cannot be undone.')) return;

    try {
      const response = await fetch(`${API_URL}/reset`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Failed to reset points');

      await fetchStudents();
    } catch (error) {
      console.error('Error resetting points:', error);
      alert('Failed to reset points. Please try again.');
    }
  };

  const exportData = () => {
    const headers = ['Name', 'Total Points', 'Meetings', 'Guest Speaker Events', 'CfE Events', 'Combo Events', 'Tier', 'Award Amount'];
    const rows = students.map(s => {
      const tier = getTier(s.points);
      return [
        `"${s.name}"`,
        s.points,
        s.meetings,
        s.guestSpeaker,
        s.cfe,
        s.combo,
        tier.name,
        tier.award
      ];
    });
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `points-tracker-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePasswordChange = async () => {
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordChangeError('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordChangeSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          setShowPasswordChangeModal(false);
          setPasswordChangeSuccess('');
        }, 2000);
      } else {
        setPasswordChangeError(data.error || 'Failed to change password');
      }
    } catch (error) {
      setPasswordChangeError('Failed to change password. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-black" />
                <h1 className="text-3xl font-bold text-gray-800">USM E-Society Points Tracker</h1>
              </div>
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Admin Login
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h2 className="font-semibold text-lg mb-3 text-gray-900">Point Values</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-600">E-Society General Body Meeting</div>
                  <div className="text-2xl font-bold text-black">1 pt</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-600">E-Society Guest Speaker Event</div>
                  <div className="text-2xl font-bold text-black">3 pts</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-600">CfE Event Attendance</div>
                  <div className="text-2xl font-bold text-black">3 pts</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <div className="text-sm text-gray-600">Golden Idea or Hackathon</div>
                  <div className="text-2xl font-bold text-black">4 pts</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4">
              <h2 className="font-semibold text-lg mb-3 text-gray-800">Travel Support Tiers</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded shadow-sm border-l-4 border-amber-700">
                  <div className="text-lg font-bold text-amber-700">Bronze</div>
                  <div className="text-2xl font-bold text-gray-800">$250</div>
                  <div className="text-sm text-gray-600">12+ points</div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm border-l-4 border-gray-400">
                  <div className="text-lg font-bold text-gray-600">Silver</div>
                  <div className="text-2xl font-bold text-gray-800">$500</div>
                  <div className="text-sm text-gray-600">22+ points</div>
                </div>
                <div className="bg-white p-4 rounded shadow-sm border-l-4 border-yellow-500">
                  <div className="text-lg font-bold text-yellow-600">Gold</div>
                  <div className="text-2xl font-bold text-gray-800">$1000</div>
                  <div className="text-sm text-gray-600">35+ points</div>
                  <div className="text-xs text-indigo-600 mt-1 font-medium">+ Conference eligibility</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Student Standings
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Points</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Meetings</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Guest Speaker</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">CfE</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Combo</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Tier</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Award</th>
                  </tr>
                </thead>
                <tbody>
                  {[...students].sort((a, b) => b.points - a.points).map((student, index) => {
                    const tier = getTier(student.points);
                    return (
                      <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-center font-bold text-gray-600">#{index + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{student.name}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-xl font-bold text-black">{student.points}</span>
                        </td>
                        <td className="py-3 px-4 text-center text-gray-600">{student.meetings}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{student.guestSpeaker}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{student.cfe}</td>
                        <td className="py-3 px-4 text-center text-gray-600">{student.combo}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${tier.color}`}>
                            {tier.name}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-green-600">{tier.award}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {students.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students added yet.
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-xl p-6">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Stipulations & Key Information</h3>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900 mb-1">Point Accrual Period:</p>
                <p>Points accumulate from <strong>July 1st to June 30th</strong> and reset annually.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Travel Support Application:</p>
                <p>Reaching a tier unlocks <strong>eligibility to apply</strong> but does not guarantee funding. Applications are processed on a priority basis depending on fund availability.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Gold Tier Extension:</p>
                <p>Gold tier members have until <strong>December 31st of the following year</strong> (6 months into the new cycle) to apply for and use their funding.</p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-2">Priority Events (for application consideration):</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Startup Pitch Competitions:</strong> Rice Business Plan Competition, TCU Values and Ventures, Baylor New Venture, MS State Startup Summit, Ole Miss Business Plan Competition, etc.</li>
                  <li><strong>Startup Hackathons:</strong> Techstars Startup Weekend Events</li>
                  <li><strong>Premier Hackathons:</strong> Y-Combinator hackathons, HackMIT, EasyA Hackathon, AngelHack, etc.</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">Conference Eligibility:</p>
                <p>Gold tier students (35+ points) and board members qualify for conference/networking travel as a <strong>separate award category</strong>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError('');
                  setUsername('');
                  setPassword('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-black" />
                <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                {loginError && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{loginError}</div>
                )}
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-black" />
              <h1 className="text-3xl font-bold text-gray-800">USM E-Society Points Tracker</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Admin Mode</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Export CSV
              </button>
              <button
                onClick={resetPoints}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Reset Year
              </button>
              <button
                onClick={() => setShowPasswordChangeModal(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-3 text-gray-900">Point Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-600">E-Society General Body Meeting</div>
                <div className="text-2xl font-bold text-black">1 pt</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-600">E-Society Guest Speaker Event</div>
                <div className="text-2xl font-bold text-black">3 pts</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-600">CfE Event Attendance</div>
                <div className="text-2xl font-bold text-black">3 pts</div>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <div className="text-sm text-gray-600">Golden Idea or Hackathon</div>
                <div className="text-2xl font-bold text-black">4 pts</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-3 text-gray-800">Travel Support Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded shadow-sm border-l-4 border-amber-700">
                <div className="text-lg font-bold text-amber-700">Bronze</div>
                <div className="text-2xl font-bold text-gray-800">$250</div>
                <div className="text-sm text-gray-600">12+ points</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border-l-4 border-gray-400">
                <div className="text-lg font-bold text-gray-600">Silver</div>
                <div className="text-2xl font-bold text-gray-800">$500</div>
                <div className="text-sm text-gray-600">22+ points</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border-l-4 border-yellow-500">
                <div className="text-lg font-bold text-yellow-600">Gold</div>
                <div className="text-2xl font-bold text-gray-800">$1000</div>
                <div className="text-sm text-gray-600">35+ points</div>
                <div className="text-xs text-indigo-600 mt-1 font-medium">+ Conference eligibility</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Add Student
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                placeholder="Student name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                onClick={addStudent}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Record Attendance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={selectedStudent || ''}
                onChange={(e) => setSelectedStudent(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Select student</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="meeting">E-Society General Body Meeting (1 pt)</option>
                <option value="guestSpeaker">E-Society Guest Speaker Event (3 pts)</option>
                <option value="cfe">CfE Event Attendance (3 pts)</option>
                <option value="combo">Golden Idea or Hackathon (4 pts)</option>
              </select>
              <button
                onClick={addPoints}
                disabled={!selectedStudent}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add Points
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Student Standings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Total Points</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Meetings</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Guest Speaker</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">CfE</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Combo</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Tier</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Award</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...students].sort((a, b) => b.points - a.points).map((student, index) => {
                  const tier = getTier(student.points);
                  return (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-center font-bold text-gray-600">#{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-gray-800">{student.name}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xl font-bold text-black">{student.points}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">{student.meetings}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{student.guestSpeaker}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{student.cfe}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{student.combo}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${tier.color}`}>
                          {tier.name}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-green-600">{tier.award}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => removeStudent(student.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {students.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No students added yet. Add your first student above!
            </div>
          )}
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-xl p-6">
          <h3 className="font-bold text-lg mb-3 text-gray-800">Stipulations & Key Information</h3>
          
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Point Accrual Period:</p>
              <p>Points accumulate from <strong>July 1st to June 30th</strong> and reset annually.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">Travel Support Application:</p>
              <p>Reaching a tier unlocks <strong>eligibility to apply</strong> but does not guarantee funding. Applications are processed on a priority basis depending on fund availability.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">Gold Tier Extension:</p>
              <p>Gold tier members have until <strong>December 31st of the following year</strong> (6 months into the new cycle) to apply for and use their funding.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-2">Priority Events (for application consideration):</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>Startup Pitch Competitions:</strong> Rice Business Plan Competition, TCU Values and Ventures, Baylor New Venture, MS State Startup Summit, Ole Miss Business Plan Competition, etc.</li>
                <li><strong>Startup Hackathons:</strong> Techstars Startup Weekend Events</li>
                <li><strong>Premier Hackathons:</strong> Y-Combinator hackathons, HackMIT, EasyA Hackathon, AngelHack, etc.</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-900 mb-1">Conference Eligibility:</p>
              <p>Gold tier students (35+ points) and board members qualify for conference/networking travel as a <strong>separate award category</strong>.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowPasswordChangeModal(false);
                setPasswordChangeError('');
                setPasswordChangeSuccess('');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-black" />
              <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordChange()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              
              {passwordChangeError && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{passwordChangeError}</div>
              )}
              
              {passwordChangeSuccess && (
                <div className="text-green-600 text-sm bg-green-50 p-3 rounded">{passwordChangeSuccess}</div>
              )}
              
              <button
                onClick={handlePasswordChange}
                className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-medium"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
