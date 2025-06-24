"use client";
import React, { useState, useEffect } from "react";
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
import { fetchTrendBySlug } from "../../utils";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";
import { BiLike } from "react-icons/bi";
import { FaBookmark, FaShare } from "react-icons/fa";
import { getCommentsByTrendId, sendUserComment } from "../../utils/comments";
import { format } from "date-fns";
import "./trend.css";
import { useUserStore } from "../../store/userStore";

type Params = {
  params: { id: string };
};

const TrendPage = ({ params }: Params) => {
  const slug = params.id;
  const [trendData, setTrendData] = useState<TrendType>();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [content, setContent] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useUserStore((state) => state);
  const [isLike, setIsLike] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Fetch comments separately to reuse
  const fetchComments = async (trendId: string) => {
    try {
      const fetched = await getCommentsByTrendId(trendId);
      setComments(
        fetched.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        }))
      );
    } catch (error) {
      toast.error("Failed to fetch comments.");
    }
  };

  const checkIfLiked = async (trendId: string) => {
    if (!user?.id) return;
    const likeRef = doc(db, "trends", trendId, "likes", user.id);
    const likeDoc = await getDoc(likeRef);
    setIsLike(likeDoc.exists());
  };

  useEffect(() => {
       if (!trendData?.id) return;

    
    const fetchTrendData = async () => {
      try {
        const trend: TrendType = await fetchTrendBySlug(slug);
        setTrendData(trend);
        await fetchComments(trend.id);
        await checkIfLiked(trend.id);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch trend data.");
        setLoading(false);
      }
    };
    fetchTrendData();

 

  const commentsRef = collection(db, "trends", trendData.id, "comments");
  const commentsQuery = query(commentsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
    const updatedComments = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        trendId: trendData.id,
        userId: data.userId,
        userName: data.userName,
        comment: data.comment,
        userProfile: data.userProfile,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
      };
    });
    setComments(updatedComments);
  });

  return () => unsubscribe(); 
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) return toast.error("Please sign in to like this trend.");
    if (isLiking || !trendData) return;

    setIsLiking(true);
    const trendRef = doc(db, "trends", trendData.id);
    const likeRef = doc(db, "trends", trendData.id, "likes", user.id);

    try {
      const likeDoc = await getDoc(likeRef);
      if (likeDoc.exists()) {
        await deleteDoc(likeRef);
        await updateDoc(trendRef, { likes: increment(-1) });
        setTrendData({ ...trendData, likes: trendData.likes - 1 });
        toast.success("Like removed.");
      } else {
        await setDoc(likeRef, {
          userId: user.id,
          likedAt: new Date().toISOString(),
        });
        await updateDoc(trendRef, { likes: increment(1) });
        setTrendData({ ...trendData, likes: trendData.likes + 1 });
        toast.success("Liked!");
      }
    } catch (error) {
      toast.error("Failed to update like.");
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
          text: "Check this out 👀",
          url: trendUrl,
        });
        toast.success("Link shared!");
      } else {
        await navigator.clipboard.writeText(trendUrl);
        toast.success("Link copied!");
      }
    } catch {
      toast.error("Could not share this trend.");
    }
  };

  const handleCommentSubmit = async () => {
  if (!user || !trendData?.id) {
    toast.error("Please sign in to add a comment.");
    return;
  }

  if (!content.trim()) {
    toast.error("Comment cannot be empty.");
    return;
  }

  const newComment = {
    id: "",
    trendId: trendData.id,
    userId: user.id,
    userName: user.name,
    comment: content,
    userProfile: user.avatar,
    createdAt: new Date(), // Firestore Timestamp will handle it
  };

  try {
    setIsSending(true);
    await sendUserComment(newComment); 
    setContent("");
    toast.success("Comment added!");
  } catch {
    toast.error("Failed to send comment.");
  } finally {
    setIsSending(false);
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
                ? format(new Date(trendData.published_date), "d MMM, yyyy")
                : "Invalid date"}
            </span>
          </div>

          <div className="trend-image">
            <Image
              priority
              src={trendData?.image}
              width={1500}
              height={1500}
              alt="trend image"
            />
          </div>

          <div className="interaction-buttons">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={isLike ? "active" : ""}
            >
              <BiLike /> {trendData?.likes}
            </button>
            <button onClick={handleShare}>
              <FaShare /> Share
            </button>
            <button>
              <FaBookmark /> Save
            </button>
          </div>

          <div
            className="trend-description"
            dangerouslySetInnerHTML={{ __html: trendData.content }}
          />

          <div className="comments-section">
            <h5>Comments</h5>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
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
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                className="btn"
                onClick={handleCommentSubmit}
                disabled={isSending || !content.trim()}
              >
                {isSending ? "Sending..." : "Send Comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default TrendPage;
