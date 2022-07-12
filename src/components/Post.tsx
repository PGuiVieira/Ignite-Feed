import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';

import { Avatar } from './Avatar';
import { Comment } from './Comment';
import styles from './Post.module.css';

interface Author {
  avatarUrl: string;
  name: string;
  role: string;
}

interface Content {
  type: 'paragraph' | 'link';
  content: string;
}

interface PostProps {
  author: Author;
  content: Content[];
  publishedAt: Date;
}

export function Post({ author, content, publishedAt }: PostProps) {
  const [comments, setComments] = useState(['post muito bacana']);
  const [newCommentText, setNewCommentText] = useState('');
  const publishedDateFormat = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });
  const publishedRelativeNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });
  const isNewCommentEmpty = newCommentText.length === 0;

  function heandleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('');
    setNewCommentText(event.target.value);
  }

  function deleteComment(commentToDelete: string) {
    const commentsWithoutDeleteOne = comments.filter((comment) => {
      return commentToDelete !== comment;
    });

    setComments(commentsWithoutDeleteOne);
  }

  function handleCreateNewComment(event: FormEvent) {
    event.preventDefault();

    setComments([...comments, newCommentText]);
    setNewCommentText('');
  }

  function handleCreateNewCommentInvalid(
    event: InvalidEvent<HTMLTextAreaElement>
  ) {
    event.target.setCustomValidity('Esse campo é obrigatório');
  }
  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name} </strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time
          title={publishedDateFormat.toString()}
          dateTime={publishedAt.toISOString()}
        >
          {publishedRelativeNow}
        </time>
      </header>
      <div className={styles.content}>
        {content.map((line) => {
          return line.type === 'paragraph' ? (
            <p key={line.content}>{line.content}</p>
          ) : (
            <p key={line.content}>
              <a href={line.content}>{line.content}</a>
            </p>
          );
        })}
      </div>
      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
          name="comment"
          placeholder="Deixe um comentário"
          onChange={heandleNewCommentChange}
          value={newCommentText}
          onInvalid={handleCreateNewCommentInvalid}
          required
        />
        <footer>
          <button type="submit" disabled={isNewCommentEmpty}>
            Publicar
          </button>
        </footer>
      </form>
      <div className={styles.commentList}>
        {comments.map((comment) => {
          return (
            <Comment
              deleteComment={deleteComment}
              key={comment}
              content={comment}
            />
          );
        })}
      </div>
    </article>
  );
}
