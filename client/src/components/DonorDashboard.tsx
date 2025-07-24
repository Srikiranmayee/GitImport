import { useState } from 'react';
import { useAuth } from '../context/BookAuthContext';
import { Plus, BookOpen, Package, Clock, CheckCircle } from 'lucide-react';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [books] = useState([
    {
      id: 1,
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      condition: 'good',
      isAvailable: true,
      requests: 2,
    },
    {
      id: 2,
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      genre: 'Classic',
      condition: 'excellent',
      isAvailable: false,
      requests: 0,
    },
  ]);

  const stats = {
    totalBooks: books.length,
    availableBooks: books.filter(book => book.isAvailable).length,
    pendingRequests: books.reduce((sum, book) => sum + book.requests, 0),
    booksShared: books.filter(book => !book.isAvailable).length,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.given_name || user?.name}!</h1>
        <p className="text-blue-100 text-lg">Ready to share more books with your community?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Books</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available</p>
              <p className="text-2xl font-bold text-gray-900">{stats.availableBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Books Shared</p>
              <p className="text-2xl font-bold text-gray-900">{stats.booksShared}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add New Book
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            View All Requests
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Manage Books
          </button>
        </div>
      </div>

      {/* Recent Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Books</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="grid gap-4">
          {books.map((book) => (
            <div key={book.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{book.title}</h3>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {book.genre}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full capitalize">
                    {book.condition}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    book.isAvailable 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {book.isAvailable ? 'Available' : 'Shared'}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                {book.requests > 0 && (
                  <div className="text-sm text-orange-600 font-medium">
                    {book.requests} request{book.requests > 1 ? 's' : ''}
                  </div>
                )}
                <button className="text-blue-600 hover:text-blue-700 text-sm mt-1">
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;