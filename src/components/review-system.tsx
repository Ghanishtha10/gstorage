
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Star, MessageSquare, ShieldCheck, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ReviewSystemProps {
  fileId: string;
}

export function ReviewSystem({ fileId }: ReviewSystemProps) {
  const db = useFirestore();
  const { toast } = useToast();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIp, setUserIp] = useState<string | null>(null);

  // Memoized query for reviews
  const reviewsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(
      collection(db, 'files', fileId, 'reviews'),
      orderBy('createdAt', 'desc')
    );
  }, [db, fileId]);

  const { data: reviews, isLoading } = useCollection(reviewsQuery);

  // Fetch user IP for restriction
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(() => console.error('Failed to fetch IP'));
  }, []);

  const hasAlreadyReviewed = reviews?.some(r => r.ipAddress === userIp);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !userIp) return;
    if (rating === 0) {
      toast({ variant: 'destructive', title: 'Rating Required', description: 'Please select a star rating.' });
      return;
    }
    if (hasAlreadyReviewed) {
      toast({ variant: 'destructive', title: 'Review Limit', description: 'This identity has already provided feedback for this asset.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'files', fileId, 'reviews'), {
        rating,
        comment,
        ipAddress: userIp,
        createdAt: new Date().toISOString(),
      });

      toast({ title: 'Feedback Synchronized', description: 'Your review has been added to the storage logs.' });
      setRating(0);
      setComment('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sync Error', description: error.message || 'Failed to submit review.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 mt-6 pt-6 border-t border-border/40">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">User Feedback</h3>
      </div>

      {!hasAlreadyReviewed ? (
        <form onSubmit={handleSubmit} className="space-y-4 bg-muted/20 p-4 rounded-xl border border-border/40">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Satisfaction Level</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    className={cn(
                      "h-6 w-6 transition-colors",
                      (hoverRating || rating) >= star 
                        ? "fill-primary text-primary shadow-primary/20" 
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Feedback Transmission</label>
            <Textarea
              id="comment"
              placeholder="Provide technical or creative feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-background/50 border-border/40 min-h-[80px] rounded-xl text-xs"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !userIp} 
            className="w-full h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {isSubmitting ? "Transmitting..." : "Initialize Submission"}
          </Button>
          
          <div className="flex items-center justify-center gap-1.5 opacity-50">
            <ShieldCheck className="h-3 w-3" />
            <span className="text-[8px] font-bold uppercase tracking-widest">IP Verification Active: {userIp || 'Scanning...'}</span>
          </div>
        </form>
      ) : (
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Identity Logged: Feedback already submitted.</p>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center py-8 opacity-40">
            <Loader2 className="h-5 w-5 animate-spin mb-2" />
            <span className="text-[8px] font-bold uppercase tracking-widest">Scanning Logs...</span>
          </div>
        ) : reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="p-4 bg-card/50 border border-border/40 rounded-xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn("h-3 w-3", s <= review.rating ? "fill-primary text-primary" : "text-muted-foreground/20")}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  {formatDistanceToNow(new Date(review.createdAt))} ago
                </span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed italic">"{review.comment}"</p>
              <div className="flex items-center gap-1 opacity-30">
                <ShieldCheck className="h-2.5 w-2.5" />
                <span className="text-[8px] font-mono">{review.ipAddress.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.***.***.$4')}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 opacity-30">
            <span className="text-[10px] font-bold uppercase tracking-widest">No feedback logs found.</span>
          </div>
        )}
      </div>
    </div>
  );
}
