import { useState } from 'react';
import { useAuth } from '../context/BookAuthContext';
import { Search, Heart, Clock, CheckCircle, Book } from 'lucide-react';

const CollectorDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [availableBooks] = useState([
    {
      id: 1,
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian Fiction',
      condition: 'excellent',
      donor: 'John Smith',
      location: 'Downtown Library',
      distance: '2.3 km',
    },
    {
      id: 2,
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      genre: 'Romance',
      condition: 'good',
      donor: 'Sarah Johnson',
      location: 'Central Park',
      distance: '1.8 km',
    },
    {
      id: 3,
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Fiction',
      condition: 'fair',
      donor: 'Mike Wilson',
      location: 'Coffee Shop',
      distance: '0.7 km',
    },
  ]);

  const [requests] = useState([
    {
      id: 1,
      bookTitle: 'To Kill a Mockingbird',
      donor: 'Alice Brown',
      status: 'pending',
      requestedAt: '2 days ago',
    },
    {
      id: 2,
      bookTitle: 'The Great Gatsby',
      donor: 'Bob Davis',
      status: 'approved',
      requestedAt: '1 week ago',
    },
  ]);

  const stats = {
    booksRequested: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length,
    booksCollected: requests.filter(r => r.status === 'completed').length,
  };

  const filteredBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.given_name || user?.name}!</h1>
        <p className="text-green-100 text-lg">Discover amazing books from your community</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Books Requested</p>
              <p className="text-2xl font-bold text-gray-900">{stats.booksRequested}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approvedRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Collected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.booksCollected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Books</h2>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Available Books */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Available Books</h2>
          <span className="text-sm text-gray-600">{filteredBooks.length} books found</span>
        </div>

        <div className="grid gap-4">
          {filteredBooks.map((book) => (
            <div key={book.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
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
                  <span className="text-xs text-gray-500">
                    {book.distance} away
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Shared by {book.donor} • {book.location}
                </p>
              </div>
              
              <div className="text-right">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Request Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Requests</h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{request.bookTitle}</h3>
                <p className="text-sm text-gray-600">from {request.donor}</p>
                <p className="text-xs text-gray-500 mt-1">Requested {request.requestedAt}</p>
              </div>
              
              <div className="text-right">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  request.status === 'pending' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectorDashboard;