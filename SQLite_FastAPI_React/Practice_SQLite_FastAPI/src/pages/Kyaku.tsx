import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Kyaku = () => {
    const navigate = useNavigate();
    const [kyakuList, setKyakuList] = useState([]); // 初期値を空文字列で設定
    const [namae, setNamae] = useState('');
    const [nenrei, setNenrei] = useState('');

    const url = "http://127.0.0.1:8000/";

    useEffect(() => {
        axios
            .get(url)
            .then((response) => {
                console.log(response.data.kyaku);
                setKyakuList(response.data.kyaku);
                // console.log(response.data[0]["image_url"]);
            })
            .catch((response) => {
                console.log(response.data);
                console.log("error");
            });
    }, []);

    const handleSubmit = async (event) => {
        console.log({ namae, nenrei });
        console.log(url + "touroku");
        axios
            .post(
                url + "touroku",
                {
                    "namae": namae,
                    "nenrei": nenrei,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                if (response.data["result"] === "success") {
                    console.log(response.data);
                    window.location.reload();//画面をリロード
                }
            })
            .catch((response) => {
                console.log(response.data);
                console.log("error");
                navigate("/error");
            });
    };
    const handleClick = async (event) => {
        navigate("/change",
            {
                state: {
                    "namae": namae, "nenrei": nenrei
                }
            });
    }
    return (
        <div>
            <VStack>
                <VStack marginBottom={8}>
                    <Text fontSize={"3xl"} >登録した客</Text>
                    <Box>
                        {kyakuList.map((kyaku) => (
                            <Text fontSize={"xl"} color='teal.500' onClick={handleClick}>{kyaku}</Text>
                        ))
                        }
                    </Box>
                </VStack>
                <Box>
                    <Text fontSize={"3xl"}>新しい客を登録する</Text>
                    <FormControl>
                        <FormLabel htmlFor="name">名前</FormLabel>
                        <Input
                            id="namae"
                            placeholder="namae"
                            value={namae}
                            onChange={(e) => setNamae(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                            id="nenrei"
                            placeholder="nenrei"
                            type="name"
                            value={nenrei}
                            onChange={(e) => setNenrei(e.target.value)}
                        />
                    </FormControl>

                    <Button mt={4} colorScheme="blue" type="submit" onClick={handleSubmit}>
                        登録
                    </Button>
                </Box>
            </VStack>
        </div>
    )
}

export default Kyaku