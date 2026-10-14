import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const BlogArticle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blog/${slug}`);
        if (res.data?.success) {
          setPost(res.data.data);
          setRecent(res.data.recent || []);
        }
      } catch (err) {
        console.error('Error fetching blog article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Loading article..." />;
  }

  if (!post) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-3xl mb-4">Article Not Found</h2>
        <Link to="/blog">
          <Button variant="primary">Return to Journal</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#572A39] hover:text-[#431E2A] mb-8 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Journal
        </Link>

        {/* Article Header */}
        <header className="space-y-4 mb-8">
          <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#252124] leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#252124]/60 border-y border-[#F2DDE1] py-3">
            <div className="flex items-center gap-2">
              {post.author?.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#572A39] text-white flex items-center justify-center font-serif text-xs">
                  S
                </div>
              )}
              <span className="font-medium text-[#252124]">
                {post.author?.name || 'Salon Editorial'}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C98F9A]" />
              <span>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C98F9A]" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#F2DDE1] mb-12 shadow-md">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Excerpt Lead */}
        <p className="text-lg md:text-xl font-serif text-[#572A39] italic font-normal leading-relaxed mb-8 border-l-2 border-[#C98F9A] pl-4">
          {post.excerpt}
        </p>

        {/* Article Body Content */}
        <div className="space-y-6 text-sm sm:text-base text-[#252124]/85 font-light leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="pt-8 mt-12 border-t border-[#F2DDE1] flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-white border border-[#F2DDE1] text-[#252124]/70 px-3 py-1 rounded-full font-light"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="my-12 p-6 rounded-2xl bg-white border border-[#F2DDE1] flex items-center gap-4">
          {post.author?.avatar ? (
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-14 h-14 rounded-full object-cover shrink-0 border border-[#C98F9A]"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#572A39] text-[#FAF7F2] font-serif font-bold text-xl flex items-center justify-center shrink-0">
              S
            </div>
          )}
          <div>
            <h4 className="font-serif text-lg font-medium text-[#252124]">
              {post.author?.name || 'The Salon Editorial Atelier'}
            </h4>
            <p className="text-xs text-[#C98F9A] font-semibold uppercase tracking-wider">
              {post.author?.role || 'Creative Director'}
            </p>
            <p className="text-xs text-[#252124]/70 font-light mt-1">
              Curating high-fashion nail artistry, Russian dry manicure science, and wellness rituals.
            </p>
          </div>
        </div>

        {/* Book Appointment CTA */}
        <div className="p-8 rounded-3xl bg-[#572A39] text-white text-center space-y-4 shadow-xl">
          <h3 className="font-serif text-2xl sm:text-3xl font-normal">
            Inspired to Transform Your Nails?
          </h3>
          <p className="text-xs sm:text-sm text-white/75 font-light max-w-md mx-auto">
            Reserve a bespoke consultation with our resident technicians in Bandra, Colaba, or Indiranagar.
          </p>
          <div className="pt-2">
            <Link to="/book">
              <Button variant="champagne" size="md">
                Book Your Nail Ritual
              </Button>
            </Link>
          </div>
        </div>

        {/* Recommended Recent Articles */}
        {recent.length > 0 && (
          <div className="pt-16 mt-16 border-t border-[#F2DDE1]">
            <h3 className="font-serif text-2xl sm:text-3xl text-center mb-8">
              More From The Journal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recent.map((item) => (
                <div key={item._id} className="luxury-card overflow-hidden flex flex-col group">
                  <div className="aspect-[16/10] overflow-hidden bg-[#F2DDE1]/30">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <h4 className="font-serif text-base font-normal group-hover:text-[#572A39] line-clamp-2">
                      <Link to={`/blog/${item.slug}`}>{item.title}</Link>
                    </h4>
                    <Link
                      to={`/blog/${item.slug}`}
                      className="text-xs text-[#572A39] font-medium mt-3 flex items-center gap-1 hover:underline"
                    >
                      Read Story <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogArticle;
