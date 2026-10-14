import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

const categories = ['All', 'Nail Care & Health', 'Trend Report', 'Technique & Lore'];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (search) params.search = search;

        const res = await api.get('/blog', { params });
        if (res.data?.success) {
          setPosts(res.data.data);
        }
      } catch (err) {
        console.error('Blog load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, search]);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Atelier Journal"
          title="Beauty, Technique &amp; Nail Culture"
          subtitle="Refined commentary on dry manicure preservation, European gel chemistry, and fashion week backstage nail styling."
        />

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#572A39] text-[#FAF7F2]'
                    : 'bg-white border border-[#F2DDE1] text-[#252124]/70 hover:border-[#572A39]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#252124]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39] bg-white"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Opening The Atelier Journal..." />
        ) : posts.length === 0 ? (
          <EmptyState
            title="No Articles Found"
            message="We couldn't find any articles matching your search or filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post._id}
                className="luxury-card overflow-hidden flex flex-col group h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#F2DDE1]/30">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="editorial-badge bg-[#FAF7F2]/95 text-[#572A39] text-[10px]">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#252124]/50 mb-2 font-medium">
                      <span>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C98F9A]" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-normal group-hover:text-[#572A39] transition-colors leading-snug mb-3">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-[#252124]/70 font-light line-clamp-3 leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F2DDE1]/60 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      {post.author?.avatar ? (
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#F2DDE1] text-[#572A39] text-[10px] font-bold flex items-center justify-center font-serif">
                          S
                        </div>
                      )}
                      <span className="text-[11px] font-medium text-[#252124]/80">
                        {post.author?.name || 'Salon Editorial'}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="text-xs font-semibold text-[#572A39] hover:underline underline-offset-4 flex items-center gap-1"
                    >
                      Read
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
