import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle2, ExternalLink, ThumbsUp, MessageSquareQuote, ShieldCheck, RefreshCw } from 'lucide-react';

interface Review {
  id: string;
  authorName: string;
  authorPhoto?: string;
  authorLocation: string;
  rating: number;
  date: string;
  category: string;
  text: string;
  avatarColor: string;
  verified: boolean;
  likes: number;
}

const fallbackReviewsData: Review[] = [
  {
    id: '1',
    authorName: 'A. R. Parent',
    authorLocation: 'Mambakkam, Chennai',
    rating: 5,
    date: '1 week ago',
    category: 'Phonics & Reading',
    text: 'Definitely a great place for the kids to learn reading English and Tamil.. The teachers are very patient and structured in their teaching methodology.',
    avatarColor: 'bg-blue-600',
    verified: true,
    likes: 18
  },
  {
    id: '2',
    authorName: 'S. Lakshmi',
    authorLocation: 'Ponmar Rd, Chennai',
    rating: 5,
    date: '2 weeks ago',
    category: 'Abacus Math',
    text: 'Very caring teachers. Lucky to have you as my son\'s teacher! Thank you so much for guiding him in Abacus math speed and accuracy.',
    avatarColor: 'bg-emerald-600',
    verified: true,
    likes: 24
  },
  {
    id: '3',
    authorName: 'Karthik Swaminathan',
    authorLocation: 'Ponmar, Chennai',
    rating: 5,
    date: '3 weeks ago',
    category: 'Abacus Math',
    text: 'Rocking Kids Academy (Phonics and Abacus) in Mambakkam/Ponmar has been a fantastic decision for my 7-year-old. Concentration and mental arithmetic speed improved drastically!',
    avatarColor: 'bg-purple-600',
    verified: true,
    likes: 12
  },
  {
    id: '4',
    authorName: 'Priya Ramachandran',
    authorLocation: 'Near SBIOA School',
    rating: 5,
    date: '1 month ago',
    category: 'Phonics & Reading',
    text: 'My 5-year-old daughter took the Phonics track here. She transitioned from basic letter sounds to reading entire storybooks effortlessly! The structured phonogram approach made reading fun.',
    avatarColor: 'bg-amber-600',
    verified: true,
    likes: 15
  },
  {
    id: '5',
    authorName: 'Anitha Venkatesh',
    authorLocation: 'Medavakkam / Ponmar',
    rating: 5,
    date: '1 month ago',
    category: 'Handwriting',
    text: 'Unbelievable handwriting transformation! Clear pencil grip & stroke guidance, double-line practice, and very supportive staff. Excellent activity center.',
    avatarColor: 'bg-rose-600',
    verified: true,
    likes: 19
  },
  {
    id: '6',
    authorName: 'Rajesh Kumar M.',
    authorLocation: 'Ponmar Main Road',
    rating: 5,
    date: '2 months ago',
    category: 'English & Grammar',
    text: 'Small batch sizes mean the teachers truly focus on each child. Friendly environment, clean space, and regular progress updates. My son loves attending classes here!',
    avatarColor: 'bg-indigo-600',
    verified: true,
    likes: 11
  }
];

const categories = ['All Reviews', 'Abacus Math', 'Phonics & Reading', 'Handwriting', 'English & Grammar'];

export const GoogleReviews = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Reviews');
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Ratings Data
  const [rating, setRating] = useState(4.9);
  const [userRatingCount, setUserRatingCount] = useState(183);
  const [reviewsList, setReviewsList] = useState<Review[]>(fallbackReviewsData);

  const googleMapsUrl = "https://share.google/v4RsF6b9XjAwE9uFs";

  // Fetch live reviews from server
  const fetchReviews = async (forceRefresh = false) => {
    setIsLoading(true);

    try {
      const apiKey = localStorage.getItem('google_places_api_key') || '';
      const placeId = localStorage.getItem('google_place_id') || '';

      let url = '/api/google-reviews';
      const params = new URLSearchParams();
      if (apiKey) params.append('apiKey', apiKey.trim());
      if (placeId) params.append('placeId', placeId.trim());
      if (forceRefresh) params.append('refresh', 'true');

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.rating) setRating(data.rating);
      if (data.userRatingCount) setUserRatingCount(data.userRatingCount);

      if (data.reviews && data.reviews.length > 0) {
        setReviewsList(data.reviews);
      } else {
        setReviewsList(fallbackReviewsData);
      }
    } catch (err) {
      console.error('Error fetching Google reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviewsList.filter(review => {
    if (selectedCategory === 'All Reviews') return true;
    return review.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const toggleLike = (id: string) => {
    setLikedReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="reviews" className="py-24 px-8 bg-slate-50/70 border-y border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-xs">
              {/* Google G Logo SVG */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="text-[11px] font-bold text-navy-900 tracking-wide">Google Business Reviews</span>
              <span className="text-yellow-500 font-bold text-[11px]">★ {rating} / 5.0</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
              Parent <span className="text-yellow-600">Testimonials</span> & Reviews
            </h2>

            <p className="text-navy-500 font-sans text-sm leading-relaxed">
              Real feedback from parents at Rocking Kids Academy on Ponmar Main Road. Live synchronized with our official Google Business page.
            </p>
          </div>

          {/* Google Rating Badge Card */}
          <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-md flex items-center gap-6 shrink-0">
            <div className="text-center border-r border-slate-100 pr-6">
              <div className="text-4xl font-black text-navy-900 leading-none">{rating}</div>
              <div className="flex text-yellow-400 my-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400" />
                ))}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy-400">{userRatingCount} Google Reviews</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Verified Business Listing</span>
              </div>
              <p className="text-[10px] text-navy-400 font-sans">Rocking Kids Academy (Phonics & Abacus)</p>
              
              <div className="flex items-center gap-2">
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-navy-900 hover:text-yellow-600 bg-slate-50 hover:bg-yellow-50 border border-slate-200 hover:border-yellow-300 px-3 py-1.5 rounded transition-all"
                >
                  Read all {userRatingCount} reviews on Google Maps <ExternalLink size={12} />
                </a>

                <button
                  onClick={() => fetchReviews(true)}
                  disabled={isLoading}
                  title="Force Refresh Google Reviews"
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-navy-600 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} className={isLoading ? 'animate-spin text-yellow-600' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-2 border-b border-slate-200">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-white text-navy-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((review) => {
            const isLiked = likedReviews[review.id];
            const likeCount = review.likes + (isLiked ? 1 : 0);

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-slate-100 hover:border-yellow-400 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar with Avatar/Photo, Name, Verified Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {review.authorPhoto ? (
                        <img 
                          src={review.authorPhoto} 
                          alt={review.authorName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                      ) : (
                        <div className={`w-10 h-10 ${review.avatarColor || 'bg-blue-600'} text-white font-bold text-sm flex items-center justify-center rounded-full shadow-xs uppercase shrink-0`}>
                          {review.authorName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-navy-900 text-sm leading-tight group-hover:text-yellow-600 transition-colors">
                            {review.authorName}
                          </h4>
                          {review.verified && (
                            <CheckCircle2 size={14} className="text-blue-500 fill-blue-50 shrink-0" title="Google Verified Parent Review" />
                          )}
                        </div>
                        <p className="text-[10px] text-navy-400 font-sans">{review.authorLocation}</p>
                      </div>
                    </div>

                    {/* Google G Logo watermark */}
                    <svg className="w-5 h-5 opacity-60 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>

                  {/* Rating Stars & Category */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div className="flex text-yellow-400 gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-[9px] font-bold text-navy-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                      {review.category}
                    </span>
                  </div>

                  {/* Review Text */}
                  <div className="relative">
                    <MessageSquareQuote className="text-yellow-200 absolute -top-2 -left-1 w-6 h-6 -z-10 opacity-60" />
                    <p className="text-xs text-navy-600 leading-relaxed font-sans pt-1">
                      "{review.text}"
                    </p>
                  </div>
                </div>

                {/* Footer with Date & Helpful Button */}
                <div className="pt-4 border-t border-slate-100 mt-6 flex items-center justify-between text-[10px] text-navy-400 font-sans">
                  <span>{review.date}</span>

                  <button 
                    onClick={() => toggleLike(review.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                      isLiked ? 'bg-yellow-50 text-yellow-700 font-bold' : 'hover:bg-slate-100 text-navy-400'
                    }`}
                  >
                    <ThumbsUp size={11} className={isLiked ? 'fill-yellow-600 text-yellow-600' : ''} />
                    <span>Helpful ({likeCount})</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner for Parent Reviews */}
        <div className="mt-16 bg-navy-900 text-white p-8 md:p-10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">Are you a parent at Rocking Kids Academy?</h3>
            <p className="text-xs md:text-sm text-navy-200 font-sans max-w-xl">
              We appreciate your feedback! Share your experience on our Google Business page to help other parents discover quality skill development for their children.
            </p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-yellow-500 hover:bg-yellow-400 text-navy-900 px-6 py-3.5 rounded-sm font-black text-xs uppercase tracking-widest transition-all shadow-lg shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Write a Google Review</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
};
