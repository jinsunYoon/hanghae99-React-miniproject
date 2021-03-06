import React from "react";
import styled from 'styled-components';
import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";

import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
    const dispatch = useDispatch();
    const is_login = useSelector((state) => state.user.is_login);
    const preview = useSelector((state) => state.image.preview);
    const post_list = useSelector((state) => state.post.list);

    const post_id = props.match.params.id;
    const is_edit = post_id ? true : false;

    const { history } = props;

    let _post = is_edit ? post_list.find((p) => p.id === post_id) : null;

    const [contents, setContents] = React.useState(_post ? _post.contents : "");

    React.useEffect(() => {
        if (is_edit && !_post) {
        console.log("포스트 정보가 없어요!");
        history.goBack();

        return;
        }

        if (is_edit) {
        dispatch(imageActions.setPreview(_post.image_url));
        }
    }, []);

    const changeContents = (e) => {
        setContents(e.target.value);
    };

    const addPost = () => {
        dispatch(postActions.addPostFB(contents));
    };

    const editPost = () => {
        dispatch(postActions.editPostFB(post_id, {contents: contents}));
    }

    if (!is_login) {
        return (
        <Grid margin="100px 0px" padding="16px" center>
            <Text size="32px" bold>
            앗! 잠깐!
            </Text>
            <Text size="16px">로그인 후에만 글을 쓸 수 있어요!</Text>
            <Button
            _onClick={() => {
                history.replace("/");
            }}
            >
            로그인 하러가기
            </Button>
        </Grid>
        );
    }

    return (
        <React.Fragment>
            <PostWriteBox>
                <Title>
                    <Grid padding="16px">
                        <Text margin="0px" size="30px" bold>
                        {is_edit ? "게시글 수정" : "게시글 작성"}
                        </Text>
                    </Grid>
                </Title>

                <Grid>
                    <Grid padding="10px 16px">
                        <Text margin="0px" size="20px" bold>
                            미리보기
                        </Text>
                    </Grid>

                    <Image
                    shape="rectangle"
                    src={preview ? preview : "http://via.placeholder.com/400x300"}
                    />
                    <Grid padding="20px 16px">
                        <Upload />
                    </Grid>
                </Grid>

                <Grid padding="16px">
                    <Text size="20px" margin="0px 0px 5px 0px" bold>게시글 내용</Text>
                    <Input
                    value={contents}
                    _onChange={changeContents}
                    placeholder="게시글 작성"
                    multiLine
                    />
                </Grid>

                <PostBtn>
                    <Grid>
                        {is_edit ? (
                        <Button text="게시글 수정" _onClick={editPost}></Button>
                        ) : (
                        <Button text="게시글 작성" _onClick={addPost}></Button>
                        )}
                    </Grid>
                </PostBtn>
            </PostWriteBox>
        </React.Fragment>
    );
};

const PostWriteBox = styled.div`
    background-color: #fff;
    width: 600px;
    margin: 20px 0px;
    border: 1px solid lightgray;
`;

const Title = styled.div`
    border-bottom: 1px solid lightgray;
`;

const PostBtn = styled.div`
    text-align: center;
    border: 1px solid lightgray;
    margin: 0px 16px 20px 16px;
    & button{
        width: 100%;
    }
    & button:hover{
        background-color: darkgrey;
        color: #fff;
    }
`;

export default PostWrite;