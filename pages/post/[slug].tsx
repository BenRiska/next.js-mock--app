import {useState} from "react"
import Link from "next/link"
import {useRouter} from "next/router"

const {BLOG_URL, CONTENT_API_KEY} = process.env


async function getPost(slug: string){
    const result = await fetch(`${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}?key=${CONTENT_API_KEY}&fields=title,slug,html`).then(res => res.json())

    return result.posts[0]
}

export const getStaticProps = async ({params}) => {
    const post = await getPost(params.slug)
    return {
      props: {post},
      revalidate: 10
    }
  }

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

type Post = {
    title: string,
    slug: string,
    html: string
}

const Post: React.FC<{post: Post}> = (props) => {

    const {post} = props
    const [enableLoadComments, setEnableLoadcomments] = useState<boolean>(true)

    const router = useRouter()

    if(router.isFallback){
        return <h1>loading...</h1>
    }

    const loadComments = () => {
        setEnableLoadcomments(prev => !prev);
        (window as any).disqus_config = function () {
            this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
            this.page.identifier = post.slug; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        const script = document.createElement('script');
        script.src = 'https://mock-blog.disqus.com/embed.js';
        script.setAttribute('data-timestamp', Date.now().toString());
        document.body.appendChild(script)
        }

    return (
        <div>
            <Link href="/"><a>Go back</a></Link>
            <h1>My blog post</h1>
            <div dangerouslySetInnerHTML={{__html: post.html}}></div>
            {enableLoadComments && <p onClick={loadComments}>Load Comments</p>}
            <div id="disqus_thread"></div>
        </div>
    )
}

export default Post