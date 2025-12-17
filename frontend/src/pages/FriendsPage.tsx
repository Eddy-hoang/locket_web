import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Check, X, Search, UserCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { friendApi } from '@/api/friend.api';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Friendship } from '@/types';
import { getChatRoute } from '@/utils/routes';
import { useAuthStore } from '@/store/authStore';

type TabType = 'friends' | 'search';

export const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [sendingRequests, setSendingRequests] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (activeTab === 'friends') {
      loadData();
    }
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [friendsData, requestsData] = await Promise.all([
        friendApi.getFriends(),
        friendApi.getPendingRequests(),
      ]);
      setFriends(friendsData);
      setPendingRequests(requestsData);
    } catch (error) {
      console.error('Load data failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await friendApi.searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendFriendRequest = async (friendId: number) => {
    if (sendingRequests.has(friendId)) return;

    setSendingRequests((prev) => new Set(prev).add(friendId));
    try {
      await friendApi.sendFriendRequest(friendId);
      // Reload data to update pending requests
      await loadData();
      // Update search results to show pending status
      setSearchResults((prev) =>
        prev.map((user) =>
          user.userId === friendId
            ? { ...user, friendshipStatus: 'PENDING' as const }
            : user
        )
      );
    } catch (error: any) {
      console.error('Send friend request failed:', error);
      alert(error.response?.data?.message || 'Không thể gửi lời mời kết bạn');
    } finally {
      setSendingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(friendId);
        return newSet;
      });
    }
  };

  const handleAccept = async (friendshipId: number) => {
    try {
      await friendApi.acceptFriendRequest(friendshipId);
      loadData();
    } catch (error) {
      console.error('Accept failed:', error);
    }
  };

  const handleReject = async (friendshipId: number) => {
    try {
      await friendApi.rejectFriendRequest(friendshipId);
      loadData();
    } catch (error) {
      console.error('Reject failed:', error);
    }
  };

  const isFriend = (userId: number): boolean => {
    return friends.some((f) => f.userId === userId);
  };

  const hasPendingRequest = (userId: number): boolean => {
    return pendingRequests.some((r) => r.friendId === userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Bạn bè</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Bạn bè
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {activeTab === 'friends' ? (
          <>
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-3">Lời mời kết bạn</h2>
                <div className="space-y-2">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar src={request.friend?.avatar} size="md" />
                        <div>
                          <p className="font-medium">{request.friend?.name}</p>
                          <p className="text-sm text-gray-500">
                            {request.friend?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(request.id)}
                          className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                          title="Chấp nhận"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                          title="Từ chối"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends List */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Danh sách bạn bè ({friends.length})
              </h2>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : friends.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl">
                  <UserPlus className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-2">Chưa có bạn bè</p>
                  <p className="text-sm text-gray-400">
                    Tìm kiếm để thêm bạn bè mới
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <div
                      key={friend.userId}
                      className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar src={friend.avatar} size="md" />
                        <div className="flex-1">
                          <p className="font-medium">{friend.name}</p>
                          <p className="text-sm text-gray-500">{friend.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => navigate(getChatRoute(friend.userId))}
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                      >
                        Nhắn tin
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Search Tab */
          <div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isSearching ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : searchQuery.trim() === '' ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Search className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">Nhập tên hoặc email để tìm kiếm</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <UserPlus className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">Không tìm thấy người dùng</p>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults
                  .filter((user) => user.userId !== currentUser?.userId)
                  .map((user) => {
                    const isAlreadyFriend = isFriend(user.userId);
                    const hasPending = hasPendingRequest(user.userId);
                    const isSending = sendingRequests.has(user.userId);

                    return (
                      <div
                        key={user.userId}
                        className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar src={user.avatar} size="md" />
                          <div className="flex-1">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="ml-2">
                          {isAlreadyFriend ? (
                            <Button
                              onClick={() => navigate(getChatRoute(user.userId))}
                              variant="ghost"
                              size="sm"
                            >
                              <UserCheck className="w-4 h-4 mr-1" />
                              Nhắn tin
                            </Button>
                          ) : hasPending ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                              className="text-gray-400"
                            >
                              Đã gửi
                            </Button>
                          ) : (
                            <Button
                              onClick={() => handleSendFriendRequest(user.userId)}
                              disabled={isSending}
                              size="sm"
                              className="bg-primary text-white hover:bg-primary-dark"
                            >
                              {isSending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  Đang gửi...
                                </>
                              ) : (
                                <>
                                  <UserPlus className="w-4 h-4 mr-1" />
                                  Kết bạn
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};