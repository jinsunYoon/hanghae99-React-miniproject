import React from 'react';
import styled from 'styled-components';
import Post from "../commonents/Post";
import CommentList from '../commonents/CommentList';
import CommentWrite from '../commonents/CommentWrite';

import { useSelector } from 'react-redux';

import { firestore } from '../shared/firebase';
import { Grid } from '../elements';

const PostDetail = (props) => {
    const id = props.match.params.id;

    const user_info = useSelector((state) => state.user.user);
    const post_list = useSelector(store => store.post.list);
    const post_idx = post_list.findIndex(p => p.id === id);
    const post_data = post_list[post_idx];

    const [post, setPost] = React.useState(post_data? post_data : null);

    React.useEffect(() => {

        if(post){
            return;
        }

        const postDB = firestore.collection("post");
        postDB.doc(id).get().then(doc => {
            console.log(doc);
            console.log(doc.data());

            let _post = doc.data();
            let post = Object.keys(_post).reduce((acc, cur) => {

                if(cur.indexOf("user_") !== -1){
                    return {...acc, user_info: {...acc.user_info, [cur]: _post[cur]}}
                };
                return {...acc, [cur]:_post[cur]};
            }, 
            {id: doc.id, user_info: {}}
            );

            setPost(post);
        })
    }, []);

    return(
        <React.Fragment>
            {post && <Post {...post} is_me = {post.user_info.user_id === user_info.uid}/>}
            <Comment>
                <Grid width="600px">
                    <CommentWrite/>
                    <CommentList/>
                </Grid>
            </Comment>
        </React.Fragment>
    )
}

const Comment = styled.div`
    background-color: #fff;
    margin-top: 20px;
    border: 1px solid lightgray;
`;

export default PostDetail;
