"use client";
import React, { useState, useEffect } from "react";
import { TrendType } from "../../fetch/types";
import { fetchTrendByID } from "../../utils";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { BiLike } from "react-icons/bi";
import { FaBookmark, FaShare } from "react-icons/fa";
import { getCommentsByTrendId, sendUserComment } from "../../utils/comments";
import { format, parseISO } from "date-fns";
import "./trend.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type Params = {
  params: { id: string };
};

type CommentType = {
  trendId: string;
  userName: string;
  comment: string;
  userProfile: string;
  createdAt: Date;
};

const TrendPage = ({ params }: Params) => {
  const { id } = params;
  const [trendData, setTrendData] = useState<TrendType>();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState<string>("");
  // const [relatedTrends, setRelatedTrends] = useState<TrendType[]>([]);
  const user = useSelector((state: RootState) => state.userdata);

  console.log(user);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const trend: TrendType = await fetchTrendByID(id);
        setTrendData(trend);
        setLoading(false);
        // Fetch related articles (simulated)
        // setRelatedTrends([trend, trend]); // This is just an example. Replace with actual fetch.
      } catch (error) {
        toast.error("Failed to fetch trend data.");
      }
    };

    const fetchComments = async () => {
      try {
        const comments = await getCommentsByTrendId(id);
        setComments(
          comments.map((comment: any) => ({
            trendId: comment.trendId,
            userName: comment.userName,
            comment: comment.comment,
            userProfile: comment.userProfile,
            createdAt: new Date(comment.createdAt),
          }))
        );
      } catch (error) {
        toast.error("Failed to fetch comments.");
      }
    };

    fetchTrendData();
    fetchComments();
  }, [id]);

  const handleLike = () => {
    toast.success("Liked the article!");
  };

  const handleShare = () => {
    toast.success("Shared the article!");
  };

  const handleCommentSubmit = async (comment: string) => {
    try {
      console.log(user);

      if (!user || !user.id || !user.userInfo || !user.userInfo.avatar) {
        toast.error("Please sign in to add a comment.");
        return;
      }

      const newComment: CommentType = {
        trendId: id,
        userName: user.name,
        comment,
        userProfile: user.userInfo.avatar,
        createdAt: new Date(),
      };
      await sendUserComment(newComment);
      setComments([...comments, newComment]);
      toast.success("Comment added!");

      setContent("");
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  return (
    <div className="trend-details-page">
      {!loading ? (
        <div className="container">
          <div className="trend-details">
            <span className="category">{trendData?.category}</span>
            <h3 className="title">{trendData?.title}</h3>
            <span>By {trendData?.author}</span>
            <span>
              {trendData?.published_date
                ? format(new Date(trendData?.published_date), "d MMM, yyyy")
                : "Invalid date"}
            </span>
          </div>
          <div className="trend-image">
            <Image
              priority
              src={trendData?.image}
              width={800}
              height={800}
              alt="trend image"
            />
          </div>

          {/* Like and Share buttons */}
          <div className="interaction-buttons">
            <button onClick={handleLike}>
              <BiLike /> {trendData.likes}
            </button>
            <button onClick={handleShare}>
              <FaShare /> Share
            </button>
            <button>
              <FaBookmark /> Save
            </button>
          </div>

          {/* Article Content */}
          <div className="trend-description">
            {trendData?.content?.split(/\r?\n/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Comment Section */}
          <div className="comments-section">
            <h5>Comments</h5>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <div className="top">
                      <div>
                        <Image
                          priority
                          src={comment.userProfile}
                          width={100}
                          height={100}
                          alt="user profile"
                        />
                        <span>{comment.userName}</span>
                      </div>
                      <span className="created-at">
                        {/* {comment.createdAt
                          ? format(comment.createdAt, "d MMM yyyy")
                          : "Invalid date"} */}
                        {comment.createdAt
                          ? format(new Date(comment.createdAt), "d MMM, yyyy")
                          : "Invalid date"}
                      </span>
                    </div>
                    <p className="comment-content">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
            <div className="send-comment">
              <textarea
                placeholder="Add a comment..."
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="btn" onClick={() => handleCommentSubmit(content)}>
                send comment
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {/* <div className="related-Trends">
            <h5>Related Trends</h5>
            <div className="related-Trends-list">
              {relatedTrends.map((trend, index) => (
                <div key={index} className="related-trend">
                  <h5>{trend.title}</h5>
                  <p>{trend.author}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default TrendPage;
