"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../lib/firebaseConfig";
import { TrendType, CommentType } from "../../fetch/types";
import { fetchTrendBySlug, getRelativeTime } from "../../utils";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { getCommentsByTrendId, sendUserComment } from "../../utils/comments";
import { format, formatDistanceToNow } from "date-fns";
import "./trend.css";
import { useUserStore } from "../../store/userStore";
import SaveVisitedTrend from "../component/SaveVIsitedTrend";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";

type Params = {
  params: { id: string };
};

const TrendPage = ({ params }: Params) => {
  useScrollRestoration();
  const slug = params.id;
  const [trendData, setTrendData] = useState<TrendType>();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useUserStore((state) => state);
  const [isLike, setIsLike] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchTrendDataAndListenToComments = async () => {
      try {
        const trend: TrendType = await fetchTrendBySlug(slug);
        setTrendData(trend);

        const commentsRef = collection(db, "trends", trend.id, "comments");
        const q = query(commentsRef, orderBy("createdAt", "desc"));

      
        unsubscribe = onSnapshot(q, (snapshot) => {
          const updatedComments = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              trendId: data.trendId,
              userId: data.userId,
              userName: data.userName,
              comment: data.comment,
              userProfile: data.userProfile,
              createdAt: data.createdAt?.toDate
                ? data.createdAt.toDate()
                : new Date(data.createdAt),
            } as CommentType;
          });
          setComments(updatedComments);
        });

       
        const likeRef = doc(db, "trends", trend.id, "likes", user.id);
        const likeDoc = await getDoc(likeRef);
        setIsLike(likeDoc.exists());
      } catch (error) {
        toast.error(error.message || "Failed to fetch trend data.", {
          id: "trend-error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendDataAndListenToComments();

    return () => unsubscribe();
  }, [slug, user]);

  const commentsRef = useRef<HTMLDivElement | null>(null);

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like this trend.", {
        id: "trend-error",
      });
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    const trendRef = doc(db, "trends", trendData.id);
    const likeRef = doc(db, "trends", trendData.id, "likes", user.id);

    try {
      const likeDoc = await getDoc(likeRef);
      if (likeDoc.exists()) {
        await deleteDoc(likeRef);
        await updateDoc(trendRef, { likes: increment(-1) });
        setTrendData({ ...trendData, likes: trendData.likes - 1 });
        setIsLike(false);
        toast.success("Like removed.");
      } else {
        await setDoc(likeRef, {
          userId: user.id,
          likedAt: new Date().toISOString(),
        });
        await updateDoc(trendRef, { likes: increment(1) });
        setTrendData({ ...trendData, likes: trendData.likes + 1 });
        setIsLike(true);
        toast.success("Liked!");
      }
    } catch (error) {
      toast.error("Failed to update like.", {
        id: "trend-error",
      });
    } finally {
      setTimeout(() => setIsLiking(false), 500);
    }
  };

  const handleShare = async () => {
    const trendUrl = `${window.location.origin}/trends/${trendData?.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: trendData?.title || "Check out this trend",
          text: `${trendData?.title}\n\nRead more here:\n`,
          url: trendUrl,
        });
      } else {
        await navigator.clipboard.writeText(trendUrl);
        toast.success("Link copied!");
      }
    } catch {
      toast.error("Could not share this trend.", {
        id: "trend-error",
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to add a comment.", {
        id: "trend-error",
      });
      return;
    }

    if (!content.trim()) {
      toast.error("Comment cannot be empty.", {
        id: "trend-error",
      });
      return;
    }

    const newComment = {
      id: "",
      trendId: trendData.id,
      userId: user.id,
      userName: user.name,
      comment: content,
      userProfile: user.avatar,
      createdAt: new Date().toISOString(),
    };

    try {
      setIsSending(true);
      await sendUserComment(newComment); // 👈 this must accept Timestamp
      setContent("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to send comment.", {
        id: "trend-error",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SaveVisitedTrend id={trendData?.id}>
      <div className="trend-details-page">
        {!loading ? (
          <div className="container">
            <div>
              <div className="trend-details">
                <span className="category">{trendData?.category}</span>
                <h3 className="title">{trendData?.title}</h3>
                <span>By {trendData?.author}</span>
                <span>
                  {trendData?.published_date
                    ? format(new Date(trendData.published_date), "d MMM, yyyy")
                    : "Invalid date"}
                </span>
              </div>

              <div className="trend-image">
                <Image
                  priority
                  src={trendData?.image}
                  width={1200}
                  height={1200}
                  alt="trend image"
                />
              </div>

              <div className="interaction-buttons">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={isLike ? "active" : ""}>
                  {isLike ? <BiSolidLike /> : <BiLike />} {trendData?.likes}
                </button>
                <button onClick={scrollToComments}>
                  <FaRegComment /> {comments?.length}
                </button>
                <button onClick={handleShare}>
                  <FaShare /> Share
                </button>
                {/*
            <button>
              <FaHeart /> Save
            </button>*/}
              </div>

              <div
                className="trend-description"
                dangerouslySetInnerHTML={{ __html: trendData?.content }}
              />
            </div>

            {/* <CommentSection ref={commentsRef} comments={comments}/> */}

            <div ref={commentsRef} className="comments-section">
              <h6>Comments {comments.length}</h6>
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p>No comments yet.</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="top">
                        <div>
                          <Image
                            width={1000}
                            height={1000}
                            priority
                            src={
                              comment.userProfile || "/assets/user_avatar.jpg"
                            }
                            alt="user profile"
                          />
                          <span>{comment.userName}</span>
                        </div>
                        <span className="created-at">
                          {comment.createdAt
                            ? getRelativeTime(new Date(comment.createdAt))
                            : "just now"}
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
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <button
                  className="btn"
                  onClick={handleCommentSubmit}
                  disabled={isSending || !content.trim()}>
                  {isSending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </SaveVisitedTrend>
  );
};

export default TrendPage;
