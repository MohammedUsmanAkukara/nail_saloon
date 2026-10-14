import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle, Search, DollarSign } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminGiftCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redeemModal, setRedeemModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [redeemAmount, setRedeemAmount] = useState('');
  const [redeemFeedback, setRedeemFeedback] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gift-cards/admin/all');
      if (res.data?.success) setCards(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const openRedeem = (card) => {
    setSelectedCard(card);
    setRedeemAmount(card.balance);
    setRedeemFeedback('');
    setRedeemModal(true);
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!selectedCard) return;
    setRedeeming(true);
    try {
      const res = await api.post('/gift-cards/admin/redeem', {
        code: selectedCard.code,
        amount: Number(redeemAmount),
      });
      if (res.data?.success) {
        setRedeemFeedback(res.data.message);
        fetchCards();
        setTimeout(() => setRedeemModal(false), 1500);
      }
    } catch (err) {
      setRedeemFeedback(err.response?.data?.message || 'Redemption failed.');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal text-[#252124]">
          Gift Card Management
        </h1>
        <p className="text-xs text-[#252124]/60 font-light mt-1">
          Monitor issued voucher balances, recipient redemptions, and expiry timelines.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#F2DDE1] shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving gift cards..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[#252124]/60 uppercase tracking-wider font-semibold border-b border-[#F2DDE1]">
                <tr>
                  <th className="py-3.5 px-4">Voucher Code</th>
                  <th className="py-3.5 px-4">Denomination</th>
                  <th className="py-3.5 px-4">Balance</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Sender</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDE1]/60">
                {cards.map((c) => (
                  <tr key={c._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#572A39]">{c.code}</td>
                    <td className="py-3.5 px-4 font-serif font-semibold text-[#252124]">
                      ₹{Number(c.denomination).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-emerald-700">
                      ₹{Number(c.balance).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      {c.recipientName} ({c.recipientEmail})
                    </td>
                    <td className="py-3.5 px-4">
                      {c.senderName} ({c.senderEmail})
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          c.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {c.status === 'active' && c.balance > 0 && (
                        <button
                          onClick={() => openRedeem(c)}
                          className="text-xs text-[#572A39] hover:underline font-semibold cursor-pointer"
                        >
                          Redeem →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Redeem Modal */}
      {redeemModal && selectedCard && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-[#F2DDE1] shadow-2xl space-y-4">
            <h3 className="font-serif text-2xl font-normal text-[#252124]">
              Redeem Gift Card
            </h3>
            <p className="text-xs text-[#252124]/60">
              Card: <strong>{selectedCard.code}</strong> (Available: ₹{selectedCard.balance})
            </p>

            {redeemFeedback && (
              <p className="text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                {redeemFeedback}
              </p>
            )}

            <form onSubmit={handleRedeem} className="space-y-4 text-xs">
              <div>
                <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                  Amount to Deduct (INR) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={selectedCard.balance}
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button type="button" variant="ghost" size="sm" onClick={() => setRedeemModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" isLoading={redeeming}>
                  Confirm Redemption
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGiftCards;
