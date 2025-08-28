import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  FlatList,
  Modal,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTikTokCredits } from '../contexts/TikTokCreditContext';

const { width } = Dimensions.get('window');

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  tiktokCredits: number;
  discount: number;
  isHot?: boolean;
  rating: number;
  soldCount: number;
};

type Order = {
  id: string;
  productName: string;
  price: number;
  status: 'pending' | 'shipped' | 'delivered';
  date: string;
  image: string;
};

type Message = {
  id: string;
  sender: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
};

type Transaction = {
  id: string;
  productName: string;
  totalAmount: number;
  tiktokShare: number;
  creatorEarnings: number;
  platformFees: number;
  date: string;
  image: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'JBL Phantom Wireless Bluetooth Headphones',
    price: 4.47,
    originalPrice: 36.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    tiktokCredits: 4.47,
    discount: 88,
    isHot: true,
    rating: 5.0,
    soldCount: 1250
  },
  {
    id: '2',
    name: 'Snow Extra-Strength Teeth Whitening Pen',
    price: 6.68,
    originalPrice: 17.80,
    image: 'https://images.unsplash.com/photo-1559591935-c6b6c3b3c3b3?w=400',
    tiktokCredits: 6.68,
    discount: 62,
    rating: 4.8,
    soldCount: 28
  },
  {
    id: '3',
    name: 'Dr. Dent Teeth Whitening Strips',
    price: 4.50,
    originalPrice: 12.99,
    image: 'https://images.unsplash.com/photo-1559591935-c6b6c3b3c3b3?w=400',
    tiktokCredits: 4.50,
    discount: 65,
    isHot: true,
    rating: 4.9,
    soldCount: 567
  },
  {
    id: '4',
    name: 'Nature\'s Key Ashwagandha Gummies',
    price: 16.58,
    originalPrice: 17.65,
    image: 'https://images.unsplash.com/photo-1559591935-c6b6c3b3c3b3?w=400',
    tiktokCredits: 16.58,
    discount: 6,
    rating: 4.7,
    soldCount: 89
  }
];

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    productName: 'JBL Phantom Wireless Headphones',
    price: 4.47,
    status: 'shipped',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
  },
  {
    id: '2',
    productName: 'Teeth Whitening Pen',
    price: 6.68,
    status: 'delivered',
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1559591935-c6b6c3b3c3b3?w=200'
  }
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'TikTok Shop Support',
    message: 'Your order has been shipped!',
    time: '2h ago',
    unread: true,
    avatar: 'https://images.unsplash.com/photo-1559591935-c6b6c3b3c3b3?w=100'
  },
  {
    id: '2',
    sender: 'Product Seller',
    message: 'Thank you for your purchase!',
    time: '1d ago',
    unread: false,
    avatar: 'https://images.unsplash.com/photo-1559591935-c6b6c3b3c3b3?w=100'
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    productName: 'JBL Phantom Wireless Headphones',
    totalAmount: 4.47,
    tiktokShare: 0.90,
    creatorEarnings: 2.68,
    platformFees: 0.89,
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200'
  },
  {
    id: '2',
    productName: 'Teeth Whitening Pen',
    totalAmount: 6.68,
    tiktokShare: 1.34,
    creatorEarnings: 4.01,
    platformFees: 1.33,
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1559591935-c6b6c3b3c3b3?w=200'
  }
];

type TabType = 'products' | 'orders' | 'messages' | 'history';

export default function ShopScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const { credits, spendCredits } = useTikTokCredits();

  const handlePurchase = (product: Product) => {
    const requiredCredits = Math.ceil(product.tiktokCredits);
    
    if (credits >= requiredCredits) {
      spendCredits(requiredCredits);
      Alert.alert(
        'Purchase Successful! 🎉',
        `You spent ${requiredCredits} TikTok credits on ${product.name}`,
        [
          {
            text: 'OK',
            onPress: () => {
              setShowProductModal(false);
              setSelectedProduct(null);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        'Insufficient Credits',
        `You need ${requiredCredits} TikTok credits to purchase this item. You currently have ${credits} credits.`,
        [
          {
            text: 'Get More Credits',
            onPress: () => {
              // Navigate to profile to claim daily credits
              setShowProductModal(false);
            }
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => {
        setSelectedProduct(item);
        setShowProductModal(true);
      }}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      {item.isHot && (
        <View style={styles.hotTag}>
          <Text style={styles.hotText}>HOT</Text>
        </View>
      )}
      <View style={styles.discountTag}>
        <Text style={styles.discountText}>-{item.discount}%</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>S${item.price.toFixed(2)}</Text>
          <Text style={styles.originalPrice}>S${item.originalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.creditsRow}>
          <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.soldCount}>{item.soldCount} sold</Text>
        </View>
        <View style={styles.creditsInfo}>
          <Text style={styles.creditsText}>🎁 {item.tiktokCredits.toFixed(2)} TikTok Credits Back!</Text>
        </View>
        <View style={styles.creditCost}>
          <Ionicons name="diamond" size={16} color="#F62A54" />
          <Text style={styles.creditCostText}>Cost: {Math.ceil(item.tiktokCredits)} credits</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderOrderCard = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <Image source={{ uri: item.image }} style={styles.orderImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderProductName}>{item.productName}</Text>
        <Text style={styles.orderPrice}>S${item.price.toFixed(2)}</Text>
        <Text style={styles.orderDate}>{item.date}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  const renderMessageCard = ({ item }: { item: Message }) => (
    <View style={styles.messageCard}>
      <Image source={{ uri: item.avatar }} style={styles.messageAvatar} />
      <View style={styles.messageInfo}>
        <Text style={styles.messageSender}>{item.sender}</Text>
        <Text style={styles.messageText} numberOfLines={2}>{item.message}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </View>
  );

  const renderTransactionCard = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <Image source={{ uri: item.image }} style={styles.transactionImage} />
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionProductName}>{item.productName}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <View style={styles.breakdownContainer}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Total Amount:</Text>
            <Text style={styles.breakdownValue}>S${item.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>TikTok Share:</Text>
            <Text style={styles.breakdownValue}>S${item.tiktokShare.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Creator Earnings:</Text>
            <Text style={styles.breakdownValue}>S${item.creatorEarnings.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Platform Fees:</Text>
            <Text style={styles.breakdownValue}>S${item.platformFees.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'shipped': return '#007AFF';
      case 'delivered': return '#34C759';
      default: return '#FFA500';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <View style={styles.productsSection}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <FlatList
              data={MOCK_PRODUCTS}
              renderItem={renderProductCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={styles.productRow}
            />
          </View>
        );
      case 'orders':
        return (
          <FlatList
            data={MOCK_ORDERS}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'messages':
        return (
          <FlatList
            data={MOCK_MESSAGES}
            renderItem={renderMessageCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'history':
        return (
          <FlatList
            data={MOCK_TRANSACTIONS}
            renderItem={renderTransactionCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TikTok Shop</Text>
        <View style={styles.headerRight}>
          <View style={styles.creditDisplay}>
            <Ionicons name="diamond" size={20} color="#F62A54" />
            <Text style={styles.creditCount}>{credits}</Text>
          </View>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            Products
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
            My Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'messages' && styles.activeTab]}
          onPress={() => setActiveTab('messages')}
        >
          <Text style={[styles.tabText, activeTab === 'messages' && styles.activeTabText]}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Product Modal */}
      <Modal
        visible={showProductModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowProductModal(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalPrice}>S${selectedProduct.price.toFixed(2)}</Text>
                    <Text style={styles.modalOriginalPrice}>S${selectedProduct.originalPrice.toFixed(2)}</Text>
                  </View>
                  <View style={styles.modalCreditsContainer}>
                    <LinearGradient
                      colors={['#FF6B6B', '#4ECDC4']}
                      style={styles.creditsGradient}
                    >
                      <Text style={styles.modalCreditsText}>
                        🎁 Get {selectedProduct.tiktokCredits.toFixed(2)} TikTok Credits Back!
                      </Text>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.creditRequirement}>
                    <Ionicons name="diamond" size={20} color="#F62A54" />
                    <Text style={styles.creditRequirementText}>
                      Required: {Math.ceil(selectedProduct.tiktokCredits)} TikTok Credits
                    </Text>
                  </View>
                  
                  <View style={styles.creditBalance}>
                    <Text style={styles.creditBalanceText}>
                      Your Balance: {credits} credits
                    </Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={[
                      styles.buyButton, 
                      credits < Math.ceil(selectedProduct.tiktokCredits) && styles.buyButtonDisabled
                    ]}
                    onPress={() => handlePurchase(selectedProduct)}
                    disabled={credits < Math.ceil(selectedProduct.tiktokCredits)}
                  >
                    <Text style={styles.buyButtonText}>
                      {credits >= Math.ceil(selectedProduct.tiktokCredits) 
                        ? 'Buy with Credits' 
                        : 'Insufficient Credits'
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cartButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  creditDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(246, 42, 84, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  creditCount: {
    color: '#F62A54',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B6B',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productsSection: {
    flex: 1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    width: (width - 60) / 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  hotTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hotText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discountTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  price: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  originalPrice: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 6,
  },
  soldCount: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  creditsInfo: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    padding: 6,
    borderRadius: 6,
  },
  creditsText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  creditCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  creditCostText: {
    color: '#F62A54',
    fontSize: 12,
    fontWeight: '600',
  },
  creditRequirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(246, 42, 84, 0.1)',
    borderRadius: 8,
  },
  creditRequirementText: {
    color: '#F62A54',
    fontSize: 16,
    fontWeight: '600',
  },
  creditBalance: {
    alignItems: 'center',
    marginBottom: 20,
  },
  creditBalanceText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  orderCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderProductName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderPrice: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  messageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  messageInfo: {
    flex: 1,
  },
  messageSender: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  messageText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: 4,
  },
  messageTime: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B6B',
    alignSelf: 'center',
  },
  transactionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  transactionImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'cover',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionProductName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  transactionDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginBottom: 16,
  },
  breakdownContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  breakdownValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  modalInfo: {
    padding: 20,
  },
  modalProductName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalPrice: {
    color: '#FF6B6B',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  modalOriginalPrice: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  modalCreditsContainer: {
    marginBottom: 20,
  },
  creditsGradient: {
    padding: 16,
    borderRadius: 12,
  },
  modalCreditsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buyButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buyButtonDisabled: {
    backgroundColor: '#666',
  },
});


