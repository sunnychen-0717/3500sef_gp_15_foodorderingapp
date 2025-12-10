import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from "firebase/firestore";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { 
  Search, ShoppingBag, Star, ChevronLeft, Plus, Minus, 
  MapPin, Clock, User, ArrowRight, CheckCircle, Search as SearchIcon,
  Home, Heart, Utensils, Settings, CreditCard, Bell, LogOut, RefreshCw,
  Trash2, Edit2, Shield, Phone, Mail
} from 'lucide-react';

const RESTAURANTS = [
  {
    id: 1,
    name: "Burger & Co.",
    rating: 4.8,
    deliveryTime: "20-30 min",  
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
    tags: ["American", "Burgers", "Fast Food"],
    menu: [
      {
        id: 101,
        name: "Classic Cheeseburger",
        description: "Juicy beef patty topped with melted cheddar, fresh lettuce, tomato, and our secret sauce on a brioche bun.",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        category: "Burgers"
      },
      {
        id: 102,
        name: "Bacon BBQ Burger",
        description: "Smoked bacon, onion rings, BBQ sauce, and cheddar cheese.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80",
        category: "Burgers"
      },
      {
        id: 103,
        name: "Crispy Fries",
        description: "Golden fried potatoes with sea salt.",
        price: 4.99,
        image: "https://images.unsplash.com/photo-1573080496987-a199f8cd4054?w=800&q=80",
        category: "Sides"
      }
    ]
  },
  {
    id: 2,
    name: "Sushi Master",
    rating: 4.9,
    deliveryTime: "35-45 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
    tags: ["Japanese", "Sushi", "Healthy"],
    menu: [
      {
        id: 201,
        name: "Salmon Roll",
        description: "Fresh salmon, avocado, and cucumber wrapped in seasoned rice and nori.",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80",
        category: "Rolls"
      },
      {
        id: 202,
        name: "Tuna Sashimi",
        description: "Premium cuts of fresh tuna served with wasabi and ginger.",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80",
        category: "Sashimi"
      }
    ]
  },
  {
    id: 3,
    name: "Pizza Paradiso",
    rating: 4.5,
    deliveryTime: "25-40 min",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    tags: ["Italian", "Pizza", "Comfort Food"],
    menu: [
      {
        id: 301,
        name: "Margherita",
        description: "Fresh basil, mozzarella di bufala, and san marzano tomato sauce.",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
        category: "Pizza"
      },
      {
        id: 302,
        name: "Pepperoni Feast",
        description: "Loaded with double pepperoni and extra cheese.",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
        category: "Pizza"
      }
    ]
  }
];

const MOCK_ORDERS = [
  { id: 'ORD-2984', restaurant: 'Burger & Co.', date: 'Oct 24, 2023', items: 'Classic Cheeseburger x 1, Crispy Fries x 1', total: 17.98, status: 'Delivered', image: RESTAURANTS[0].image },
  { id: 'ORD-2983', restaurant: 'Sushi Master', date: 'Oct 20, 2023', items: 'Salmon Roll x 2, Miso Soup x 1', total: 24.50, status: 'Delivered', image: RESTAURANTS[1].image },
];

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button' }) => {
  const baseStyle = "w-full py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95";
  const variants = {
    primary: "bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border-2 border-gray-200 text-gray-600 hover:border-orange-500 hover:text-orange-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button type={type} onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, type, placeholder, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input 
      type={type} 
      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export default function FoodDeliveryApp() {
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [notification, setNotification] = useState(null);
  const [favorites, setFavorites] = useState([1]); 
  const [pastOrders, setPastOrders] = useState(MOCK_ORDERS);
  const [userAddress, setUserAddress] = useState("123 Main St, New York, NY");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: '123 Main St, New York, NY 10001' },
    { id: 2, label: 'Work', address: '456 Market St, San Francisco, CA 94103' }
  ]);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'Visa', last4: '4242' },
    { id: 2, type: 'Mastercard', last4: '8888' }
  ]);
  const [notifications, setNotifications] = useState({
    orders: true,
    promos: false,
    delivery: true
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.email.split('@')[0],
          email: currentUser.email,
          phone: ''
        });
        setView('home');
      } else {
        setUser(null);
        setView('login');
      }
    });
    return () => unsubscribe();
  }, []);

 
  
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "orders"), 
        where("user_email", "==", user.email)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const syncedOrders = snapshot.docs.map(doc => {
          const data = doc.data();
          const dateObj = data.order_time?.toDate(); 
          
          return {
            id: data.order_id || doc.id,
            restaurant: data.items[0]?.restaurantName || "TastyBytes Order",
            
            
            date: dateObj ? dateObj.toLocaleString('en-US', {
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: false 
            }) : "Just now",
            
            items: data.items.map(i => `${i.name} x${i.qty}`).join(", "),
            total: parseFloat(data.total_price),
            status: data.status,
            image: data.items[0]?.image,
            raw_timestamp: data.order_time 
          };
        });
        
        
        syncedOrders.sort((a, b) => {
            const timeA = a.raw_timestamp?.seconds || 0;
            const timeB = b.raw_timestamp?.seconds || 0;
            return timeB - timeA;
        });

        setPastOrders(syncedOrders);
      });

      return () => unsubscribe();
    }
  }, [user]);
  

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setUserAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        setLocationCoords({ lat, lng });
        
        setIsLoadingLocation(false);
        showNotification("Location updated via GPS!");
      },
      (error) => {
        alert("Unable to retrieve location: " + error.message);
        setIsLoadingLocation(false);
      }
    );
  };
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        showNotification("Registration successful!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showNotification("Login successful!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    showNotification("Logged out successfully");
  };

  const addToCart = (food, restaurantName) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === food.id);
      if (existing) {
        return prev.map(item => item.id === food.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...food, qty: 1, restaurantName }];
    });
    showNotification(`Added ${food.name} to cart`);
  };

  const removeFromCart = (foodId) => {
    setCart(prev => prev.filter(item => item.id !== foodId));
  };

  const updateQty = (foodId, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === foodId) {
        const newQty = Math.max(0, item.qty + change);
        return newQty === 0 ? null : { ...item, qty: newQty };
      }
      return item;
    }).filter(Boolean));
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login to checkout");
      setView("login");
      return;
    }
    
    if (cart.length === 0) return;

    try {

      const uniqueOrderId = "ORD-" + Math.random().toString(36).substr(2, 6).toUpperCase();

      await addDoc(collection(db, "orders"), {
        order_id: uniqueOrderId, 
        user_email: user.email,
        user_name: user.name,
        items: cart,
        total_price: (cartTotal + 2.99).toFixed(2),
        status: "Pending",
        order_time: serverTimestamp(),
        delivery_address: userAddress,
        location_coords: locationCoords
      });

      setLastOrderId(uniqueOrderId);
      setCart([]); 
      setView('tracking'); 
      
    } catch (error) {
      alert("Checkout failed: " + error.message);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleFavorite = (e, restaurantId) => {
    e.stopPropagation();
    if (favorites.includes(restaurantId)) {
      setFavorites(prev => prev.filter(id => id !== restaurantId));
      showNotification("Removed from favorites");
    } else {
      setFavorites(prev => [...prev, restaurantId]);
      showNotification("Added to favorites");
    }
  };

  const LoginView = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">TastyBytes</h1>
        <p className="text-gray-500 mt-2">Food delivery made simple</p>
      </div>

      <form onSubmit={handleAuth}>
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="hello@example.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {!isRegistering && (
          <div className="flex justify-end mb-6">
            <button 
              type="button"
              onClick={() => setView('forgot-pass')}
              className="text-sm text-orange-600 font-medium hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        )}

        <Button type="submit">{isRegistering ? 'Sign Up' : 'Log In'}</Button>
      </form>
      
      <p className="mt-6 text-center text-gray-500 text-sm">
        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
        <button 
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-orange-600 font-bold cursor-pointer hover:underline"
        >
          {isRegistering ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );

  const ForgotPasswordView = () => (
    <div className="min-h-screen bg-white p-6 flex flex-col pt-20">
      <button onClick={() => setView('login')} className="mb-8 flex items-center text-gray-600">
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Login
      </button>
      
      <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
      <p className="text-gray-500 mb-8">Enter your email and we'll send you a link to reset your password.</p>
      
      <Input label="Email Address" type="email" placeholder="hello@example.com" />
      <Button onClick={() => { showNotification("Reset link sent!"); setView('login'); }}>Send Reset Link</Button>
    </div>
  );

  const HomeView = () => {
    const filteredRestaurants = RESTAURANTS.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white p-6 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500">Delivering to</p>
              <button 
                onClick={handleGetLocation} 
                className="flex items-center text-orange-600 font-bold hover:bg-orange-50 px-2 py-1 rounded-lg -ml-2 transition-colors"
                disabled={isLoadingLocation}
              >
                <MapPin className={`w-4 h-4 mr-1 ${isLoadingLocation ? 'animate-bounce' : ''}`} />
                <span>{isLoadingLocation ? "Locating..." : userAddress}</span>
              </button>
            </div>
            <div onClick={() => setView('profile')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          {locationCoords && (
            <div className="mt-3 mb-4 rounded-xl overflow-hidden h-48 shadow-md border border-gray-200 relative">
              <iframe
                title="User Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://maps.google.com/maps?q=${locationCoords.lat},${locationCoords.lng}&z=15&output=embed`}
              >
              </iframe>
              <button 
                onClick={() => setLocationCoords(null)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          )}

          <div className="relative">
            <SearchIcon className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" className="w-full bg-gray-100 pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Restaurants, food, drinks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6">
          <h3 className="font-bold text-lg mb-4">Popular Restaurants</h3>
          <div className="grid gap-6">
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant.id} onClick={() => { setSelectedRestaurant(restaurant); setView('menu'); }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group">
                <div className="h-40 overflow-hidden relative">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-3 right-3">
                    <button onClick={(e) => toggleFavorite(e, restaurant.id)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Heart className={`w-4 h-4 ${favorites.includes(restaurant.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                    {restaurant.deliveryTime}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-lg">{restaurant.name}</h4>
                    <div className="flex items-center bg-green-100 px-2 py-0.5 rounded text-green-700 text-xs font-bold">
                      <Star className="w-3 h-3 mr-1 fill-current" /> {restaurant.rating}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {restaurant.tags.map(tag => <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const FavoritesView = () => {
    const favoriteRestaurants = RESTAURANTS.filter(r => favorites.includes(r.id));

    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white p-6 shadow-sm sticky top-0 z-10">
           <div className="flex items-center gap-3">
            <button onClick={() => setView('home')}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">My Favorites</h1>
          </div>
        </div>
        <div className="p-6">
          {favoriteRestaurants.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-center text-gray-500">
              <Heart className="w-16 h-16 mb-4 text-gray-300" />
              <p>No favorites yet.</p>
              <p className="text-sm mt-1">Go back home to add some!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {favoriteRestaurants.map(restaurant => (
                <div 
                  key={restaurant.id} 
                  onClick={() => { setSelectedRestaurant(restaurant); setView('menu'); }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="h-40 overflow-hidden relative">
                    <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <button 
                        onClick={(e) => toggleFavorite(e, restaurant.id)}
                        className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg">{restaurant.name}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      {restaurant.rating} • {restaurant.tags[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const OrdersView = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10">
         <div className="flex items-center gap-3">
            <button onClick={() => setView('home')}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
      </div>
      <div className="p-6 space-y-4">
        {pastOrders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex gap-4 mb-4">
              <img src={order.image} className="w-16 h-16 rounded-lg object-cover bg-gray-200" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-gray-900">{order.restaurant}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{order.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-1">{order.items}</p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-3">
              <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
              <button 
                onClick={() => showNotification("Order re-added to cart!")}
                className="flex items-center text-orange-600 text-sm font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-1" /> Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EditProfileView = () => {
    const [formData, setFormData] = useState({ 
      name: user?.name || '', 
      email: user?.email || '',
      phone: user?.phone || ''
    });

    const handleSave = () => {
      setUser({ ...user, ...formData });
      showNotification("Profile updated successfully!");
      setView('profile');
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white p-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
          <button onClick={() => setView('profile')}>
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold">Edit Profile</h1>
        </div>
        
        <div className="p-6">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center relative">
              <User className="w-12 h-12 text-orange-500" />
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100">
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
               <div className="relative">
                 <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   value={formData.name}
                   onChange={(e) => setFormData({...formData, name: e.target.value})}
                   className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500"
                 />
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
               <div className="relative">
                 <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                 <input 
                   type="email" 
                   value={formData.email}
                   onChange={(e) => setFormData({...formData, email: e.target.value})}
                   className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500"
                 />
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
               <div className="relative">
                 <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   value={formData.phone}
                   onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-orange-500"
                 />
               </div>
            </div>
          </div>

          <Button className="mt-8" onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    );
  };

  const AddressesView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('profile')}>
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold">Addresses</h1>
        </div>
        <button className="text-orange-600 font-bold text-sm">Add New</button>
      </div>

      <div className="p-6 space-y-4">
        {addresses.map(addr => (
          <div key={addr.id} className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
            <div className="bg-orange-50 p-2 rounded-lg">
              <MapPin className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{addr.label}</h4>
              <p className="text-sm text-gray-500 mt-1 leading-snug">{addr.address}</p>
            </div>
            <button className="text-gray-400 hover:text-red-500">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentMethodsView = () => (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-white p-6 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('profile')}>
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold">Payments</h1>
        </div>
        <button className="text-orange-600 font-bold text-sm">Add New</button>
      </div>

      <div className="p-6 space-y-4">
        {paymentMethods.map(method => (
          <div key={method.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-900">{method.type}</h4>
              <p className="text-sm text-gray-500">•••• •••• •••• {method.last4}</p>
            </div>
            <button className="text-gray-400 hover:text-red-500">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => setView('profile')}>
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold">Notifications</h1>
      </div>

      <div className="p-6 bg-white m-6 rounded-2xl shadow-sm space-y-6">
        {[
          { key: 'orders', label: 'Order Updates', desc: 'Get updates on your current orders' },
          { key: 'promos', label: 'Promotions', desc: 'Receive exclusive offers and discounts' },
          { key: 'delivery', label: 'Delivery Arrivals', desc: 'Get notified when driver is nearby' },
        ].map((item) => (
          <div key={item.key} className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-gray-900">{item.label}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
            <button 
              onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key]})}
              className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key] ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-all ${notifications[item.key] ? 'left-6.5 translate-x-1' : 'left-0.5'}`}></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const SettingsView = () => (
     <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-6 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => setView('profile')}>
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="p-6 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <span className="font-medium">Language</span>
          <span className="text-gray-500 text-sm flex items-center gap-1">English <ChevronLeft className="w-4 h-4 rotate-180" /></span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <span className="font-medium">Theme</span>
          <span className="text-gray-500 text-sm flex items-center gap-1">Light Mode <ChevronLeft className="w-4 h-4 rotate-180" /></span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
          <span className="font-medium">Privacy Policy</span>
          <Shield className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-6 shadow-sm mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-2xl font-bold">
            {user?.name?.charAt(0) || 'G'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name || 'Guest'}</h1>
            <p className="text-gray-500 text-sm">{user?.email || 'guest@example.com'}</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center">
            <p className="font-bold text-xl">12</p>
            <p className="text-xs text-gray-500 uppercase">Orders</p>
          </div>
          <div className="flex-1 bg-gray-50 p-3 rounded-xl text-center">
            <p className="font-bold text-xl">4</p>
            <p className="text-xs text-gray-500 uppercase">Favorites</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-3">
        {[
          { icon: User, label: 'Edit Profile', action: () => setView('edit-profile') },
          { icon: MapPin, label: 'Saved Addresses', action: () => setView('addresses') },
          { icon: CreditCard, label: 'Payment Methods', action: () => setView('payments') },
          { icon: Bell, label: 'Notifications', action: () => setView('notifications') },
          { icon: Settings, label: 'Settings', action: () => setView('settings') },
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={item.action}
            className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-gray-600" />
              </div>
              <span className="font-medium text-gray-700">{item.label}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
        ))}

        <button 
          onClick={handleLogout}
          className="w-full bg-white p-4 rounded-xl flex items-center gap-3 text-red-500 shadow-sm mt-6 hover:bg-red-50"
        >
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-red-500" />
          </div>
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );

  const MenuView = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="relative h-48">
        <img src={selectedRestaurant.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
        <button 
          onClick={() => setView('home')}
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button 
          onClick={(e) => toggleFavorite(e, selectedRestaurant.id)}
          className="absolute top-6 right-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
           <Heart className={`w-5 h-5 ${favorites.includes(selectedRestaurant.id) ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-3xl font-bold">{selectedRestaurant.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm opacity-90">
            <span className="flex items-center"><Star className="w-4 h-4 mr-1 fill-white" /> {selectedRestaurant.rating}</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {selectedRestaurant.deliveryTime}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg mb-4">Menu</h3>
        <div className="space-y-4">
          {selectedRestaurant.menu.map(item => (
            <div 
              key={item.id} 
              onClick={() => { setSelectedFood(item); setView('food-detail'); }}
              className="bg-white p-4 rounded-2xl flex gap-4 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                <span className="font-semibold text-orange-600">${item.price}</span>
              </div>
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                <img src={item.image} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FoodDetailView = () => {
    const [qty, setQty] = useState(1);

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="relative h-72">
          <img src={selectedFood.image} className="w-full h-full object-cover" />
          <button 
            onClick={() => setView('menu')}
            className="absolute top-6 left-6 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        <div className="flex-1 p-6 rounded-t-3xl -mt-6 bg-white relative z-10">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
          
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold w-3/4">{selectedFood.name}</h1>
            <span className="text-2xl font-bold text-orange-600">${selectedFood.price}</span>
          </div>

          <p className="text-gray-500 leading-relaxed mb-8">
            {selectedFood.description}
          </p>

          <div className="border-t border-b border-gray-100 py-6 mb-8">
             <h3 className="font-bold mb-4">Preparation Note</h3>
             <textarea 
               className="w-full bg-gray-50 rounded-xl p-4 text-sm focus:ring-1 focus:ring-orange-500 outline-none"
               placeholder="e.g. No onions, extra sauce..."
             ></textarea>
          </div>
        </div>

        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-xl px-2">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg font-bold"
              >-</button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 text-lg font-bold"
              >+</button>
            </div>
            <Button onClick={() => {
              for(let i=0; i<qty; i++) addToCart(selectedFood, selectedRestaurant.name);
              setView('menu');
            }}>
              Add ${(selectedFood.price * qty).toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const CartView = () => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-6 shadow-sm flex items-center">
        <button onClick={() => setView('home')} className="mr-4">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <h1 className="text-xl font-bold">My Cart</h1>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p>Your cart is empty</p>
            <Button variant="outline" className="mt-4 w-auto px-8" onClick={() => setView('home')}>
              Browse Food
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-xs text-gray-500 mb-1">{item.restaurantName}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-orange-600">${item.price}</span>
                    <div className="flex items-center bg-gray-50 rounded-lg">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center text-gray-600">-</button>
                      <span className="text-xs font-bold px-1">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center text-gray-600">+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="bg-white p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between mb-2 text-gray-500">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-6 text-gray-500">
            <span>Delivery Fee</span>
            <span>$2.99</span>
          </div>
          <div className="flex justify-between mb-6 text-xl font-bold">
            <span>Total</span>
            <span>${(cartTotal + 2.99).toFixed(2)}</span>
          </div>
          <Button onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      )}
    </div>
  );

  const TrackingView = () => (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="z-10 w-full max-w-md text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold mb-2">Order Placed!</h2>
        
        <div className="bg-gray-800 py-2 px-4 rounded-lg mb-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Order ID</p>
          <p className="text-xl font-mono text-orange-400 tracking-wider">{lastOrderId}</p>
        </div>

        <p className="text-gray-400 mb-10">Estimated delivery: 25 mins</p>

        <div className="bg-gray-800 rounded-2xl p-6 text-left space-y-8 relative">
          <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gray-700"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-gray-800">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="font-bold">Order Confirmed</p>
              <p className="text-xs text-gray-500">Your order has been received</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center ring-4 ring-gray-800 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div>
              <p className="font-bold text-orange-500">Preparing Food</p>
              <p className="text-xs text-gray-500">The chef is working on it</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 opacity-50">
            <div className="w-6 h-6 bg-gray-600 rounded-full ring-4 ring-gray-800"></div>
            <div>
              <p className="font-bold">On the Way</p>
              <p className="text-xs text-gray-500">Driver is picking up</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 opacity-50">
            <div className="w-6 h-6 bg-gray-600 rounded-full ring-4 ring-gray-800"></div>
            <div>
              <p className="font-bold">Delivered</p>
              <p className="text-xs text-gray-500">Enjoy your meal!</p>
            </div>
          </div>
        </div>

        <Button className="mt-8 bg-gray-800 hover:bg-gray-700" onClick={() => setView('home')}>
          Back to Home
        </Button>
      </div>
    </div>
  );

  const renderView = () => {
    switch(view) {
      case 'login': return LoginView();
      case 'forgot-pass': return <ForgotPasswordView />;
      case 'home': return <HomeView />;
      case 'menu': return <MenuView />;
      case 'food-detail': return <FoodDetailView />;
      case 'cart': return <CartView />;
      case 'tracking': return <TrackingView />;
      case 'favorites': return <FavoritesView />;
      case 'orders': return <OrdersView />;
      case 'profile': return <ProfileView />;
      case 'edit-profile': return <EditProfileView />;
      case 'addresses': return <AddressesView />;
      case 'payments': return <PaymentMethodsView />;
      case 'notifications': return <NotificationsView />;
      case 'settings': return <SettingsView />;
      default: return <LoginView />;
    }
  };

  return (
    <div className="font-sans text-gray-900 max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
      {renderView()}

      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl z-50 text-sm font-semibold flex items-center animate-fade-in-down">
          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
          {notification}
        </div>
      )}

      {['home', 'menu', 'favorites', 'orders', 'profile'].includes(view) && (
        <div className="fixed bottom-0 max-w-md w-full bg-white border-t border-gray-100 p-4 flex justify-around items-center z-40 pb-6">
          <button onClick={() => setView('home')} className={`flex flex-col items-center ${view === 'home' ? 'text-orange-500' : 'text-gray-400'}`}>
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1">Home</span>
          </button>
          
          <button onClick={() => setView('favorites')} className={`flex flex-col items-center ${view === 'favorites' ? 'text-orange-500' : 'text-gray-400'}`}>
            <Heart className={`w-6 h-6 ${view === 'favorites' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold mt-1">Favorites</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setView('cart')}
              className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-500/30 -mt-8 border-4 border-gray-50"
            >
              <ShoppingBag className="w-6 h-6" />
            </button>
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 -mt-8 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartItemCount}
              </span>
            )}
          </div>

          <button onClick={() => setView('orders')} className={`flex flex-col items-center ${view === 'orders' ? 'text-orange-500' : 'text-gray-400'}`}>
            <Clock className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1">Orders</span>
          </button>
          
          <button onClick={() => setView('profile')} className={`flex flex-col items-center ${view === 'profile' ? 'text-orange-500' : 'text-gray-400'}`}>
            <User className={`w-6 h-6 ${view === 'profile' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-bold mt-1">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
}