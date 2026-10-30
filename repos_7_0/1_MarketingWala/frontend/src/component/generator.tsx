import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import MarketingCampaignInputForm from './form';
import { fetchCampaignData, submitUpdatedCampaign } from '../api/campaignAPI';
import LoadingSpinner from './LoadingSpinner';
import CampaignCard from './CampaignCard';
import { fetchCardData,fetchNotificationData,submitNotification,fetchNotification } from '../api/campaignAPI';

export default function Generator() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<any>(null);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isPostModal, setIsPostModal] = useState(false);
  const [notificationData, setNotificationData] = useState<any[]>([]);
  const [notif, setNotif] = useState<any[]>([]);

    const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCardData(null);
    setIsPostModal(false);
    setSelectedNotification(null);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const handleAddClick = () => {
    setIsModalOpen(true);
  };
  const handleAddPost =() => {
    setIsPostModal(true);
  }

  const handleCampaignFetchSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchCampaignData(data);
      setCampaignData(response);
      closeModal();
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignUpdateSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const { campaignScheduling } = formData;
      const updatedData = {
        campaignScheduling,
        imageUrl: selectedCardData.images[0],
        caption: selectedCardData.caption,
      };
      console.log(formData)
      await submitUpdatedCampaign(updatedData);
      closeModal();
    } catch (error) {
      console.error('Failed to submit updated campaign data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationFetchSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetchNotificationData(data);
      setNotificationData(response.notifications);
      closeModal();
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotifcationSubmit= async (data:any)=> {
    setLoading(true);
    try{
      const { campaignScheduling } = data;
    const updatedData ={
      campaignScheduling,
      notification: selectedNotification
    }
    console.log(updatedData)
    await submitNotification(updatedData);
    closeModal();
  } catch (error) {
    console.error('Failed to submit updated campaign data', error);
  } finally {
    setLoading(false);
  }
  }

  const fetchCardsFromAPI = async () => {
    setLoading(true);
    try {
      const response = await fetchCardData();
      setCards(response);
    } catch (error) {
      console.error('Failed to fetch card data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchNotificationFromAPI = async () => {
    setLoading(true);
    try {
      const response = await fetchNotification();
      setNotif(response);
    } catch (error) {
      console.error('Failed to fetch card data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCardsFromAPI();
    fetchNotificationFromAPI();
  }, []);

  const openFormModal = (cardData: any) => {
    setSelectedCardData(cardData);
    setIsModalOpen(true);
  };

  const openPushFormModal =(data: any)=> {
    setSelectedNotification(data)
    setIsModalOpen(true);
  }



  console.log(notificationData)

  return (
    <div className="relative w-full max-w-6xl mx-auto p-4">
      <div className="relative overflow-hidden rounded-3xl p-6">
        {cards.length < 3 ? (
          // If less than 3 cards, display cards statically (no carousel)
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {cards.map((card) => (
              <div
                key={card.id}
                className="max-w-lg mx-auto relative transform transition-transform duration-300"
                onMouseEnter={() => setSelectedCardData(card)}
                onMouseLeave={() => setSelectedCardData(null)}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden relative transform transition-all duration-300 ease-in-out">
                  <img
                    src={card.imageUrl}
                    alt="Campaign Image"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-gray-700 text-lg">{card.caption}</p>
                  </div>
                </div>

                {/* Full card display as a pop-up modal on hover */}
                {selectedCardData?.id === card.id && (
                  <div className="absolute top-0 left-0 w-full h-full bg-white rounded-xl shadow-2xl p-4 flex flex-col justify-center items-center z-50 transform scale-110">
                    <img
                      src={card.imageUrl}
                      alt="Full Campaign Image"
                      className="w-full h-64 object-cover"
                    />
                    <p className="mt-4 text-gray-700 text-xl">{card.caption}</p>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={handleAddClick}
              className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition-colors"
              aria-label="Add new item"
            >
              <Plus size={24} />
            </button>
          </div>
        ) : (
          // Carousel for 3 or more cards
          <div className="relative">
            <div className="flex items-center justify-center h-[500px] relative">
              {[-1, 0, 1].map((offset) => {
                const index = (currentIndex + offset + cards.length) % cards.length;
                return (
                  <div
                    key={cards[index]?.id || index}
                    className={`absolute transition-all duration-300 ease-in-out ${
                      offset === -1
                        ? 'left-1/4 transform -translate-x-1/2 opacity-50 scale-90 z-0'
                        : offset === 0
                        ? 'left-1/2 transform -translate-x-1/2 opacity-100 scale-105 z-10'
                        : 'right-1/4 transform translate-x-1/2 opacity-50 scale-90 z-0'
                    }`}
                  >
                    <div
                      className="bg-white rounded-xl shadow-lg h-[400px] w-[400px] flex flex-col overflow-hidden relative transform transition-all duration-300 ease-in-out hover:scale-105"
                      onMouseEnter={() => setSelectedCardData(cards[index])}
                      onMouseLeave={() => setSelectedCardData(null)}
                    >
                      <img
                        src={cards[index]?.imageUrl || ''}
                        alt="Campaign"
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-6">
                        <p className="text-gray-700 text-lg">{cards[index]?.caption || 'Loading...'}</p>
                      </div>

                      {/* Full card display on hover (as pop-up) */}
                      {selectedCardData?.id === cards[index]?.id && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white rounded-xl shadow-2xl p-4 flex flex-col justify-center items-center z-50 transform scale-110">
                          <img
                            src={cards[index]?.imageUrl || ''}
                            alt="Full Campaign Image"
                            className="w-full h-64 object-cover"
                          />
                          <p className="mt-4 text-gray-700 text-xl">{cards[index]?.caption}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex items-center space-x-4">
              <button
                onClick={nextSlide}
                className="bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight size={32} />
              </button>
              <button
                onClick={handleAddClick}
                className="bg-blue-500 text-white p-4 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                aria-label="Add new item"
              >
                <Plus size={32} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal} />
          <div className="relative z-50">
            <MarketingCampaignInputForm
              steps={[1, 2, 3,4,5]}
              onClose={closeModal}
              onCampaignDataSubmit={handleCampaignFetchSubmit}
            />
          </div>
        </div>
      )}

      {loading && <LoadingSpinner />}

      {campaignData && (
  <div className="bg-white p-4 w-full min-h-screen">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"> {/* Increase gap */}
      {Object.keys(campaignData).map((key) => (
        <div
          key={key}
          className="max-w-xs mx-auto relative"
          onClick={() => openFormModal(campaignData[key])}
        >
          <CampaignCard
            imageUrl={campaignData[key].images[0]}
            caption={campaignData[key].caption}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      ))}
    </div>
  </div>
)}


      {selectedCardData && isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal} />
          <div className="relative z-50 p-4 bg-white rounded-lg">
            <MarketingCampaignInputForm
              steps={[6]}
              onClose={closeModal}
              onCampaignDataSubmit={handleCampaignUpdateSubmit}
            />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center w-full mt-8">
  {/* Message Inbox Container */}
  <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4">
    <h2 className="text-lg font-semibold text-gray-700 mb-4">Messages</h2>

    {/* Chat Thread - Repeat this block for each chat */}
    <div className="flex items-center justify-between p-3 border-b border-gray-200">
      {notif.map((i, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border-b border-gray-200"
                >
                  <div className="flex items-center">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="logo"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <p className="text-gray-700 font-semibold">{i.notification}</p>
                    </div>
                  </div>
                </div>
              ))}
    </div>

    {/* Additional chat threads can be stacked like this */}

    {/* Plus Button Below to Add New Chat */}
        <button
      onClick={handleAddPost}
      className="flex items-center justify-center w-48 bg-blue-500 text-white py-3 px-6 rounded-full shadow-md mt-4 hover:bg-blue-600 transition-colors"
      aria-label="Add new chat"
    >
      <Plus size={20} className="mr-2" />
      <span className="text-sm font-medium">New Chat</span>
    </button>
    {isPostModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal} />
          <div className="relative z-50">
            <MarketingCampaignInputForm
              steps={[2,7]}
              onClose={closeModal}
              onCampaignDataSubmit={handleNotificationFetchSubmit}
            />
          </div>
        </div>
      )}
      {notificationData && (
        <div className="bg-white p-4 w-full min-h-screen">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {notificationData.map((message, index) => (
          <div
            key={index} // Use the index as a key
            className="max-w-xs mx-auto relative"
            onClick={() => openPushFormModal(message)} // If you need to open a modal with the message
          >
            <div>
              <h3 className="text-gray-700">{message}</h3> {/* Display the message */}
            </div>
          </div>
        ))}
          </div>
        </div>
      )}
      {selectedNotification && isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeModal} />
          <div className="relative z-50 p-4 bg-white rounded-lg">
            <MarketingCampaignInputForm
              steps={[6]}
              onClose={closeModal}
              onCampaignDataSubmit={handleNotifcationSubmit}
            />
          </div>
        </div>
      )}
  </div>
</div>

    </div>
  );
}
