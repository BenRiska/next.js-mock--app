import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from "next/link"

const {BLOG_URL, CONTENT_API_KEY} = process.env


async function getPosts(){

  const result = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}&fields=title,slug,custom_excerpt`).then(res => res.json())

  return result.posts
}

export const getStaticProps = async ({params}) => {
  const posts = await getPosts()
  return {
    props: {posts},
    revalidate: 10
  }
}

type Post = {
  title: String,
  slug: String,
  custom_excerpt: String
}

const Home:React.FC<{posts: Post[]}> = (props) => {

  const {posts} = props

  return (
    <div className={styles.container}>
      <h1>Welcome to my blog</h1>
      <ul>
        {posts.map((post,index) => 
        <li key={index}>
          <Link href="/post/[slug]" as={`/post/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
        </li>)}
      </ul>
    </div>
  )
}

export default Home