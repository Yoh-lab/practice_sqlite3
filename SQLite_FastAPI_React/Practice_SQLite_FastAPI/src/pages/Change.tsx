import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

const Change = () => {
    const navigate = useNavigate();
    const [changedNamae, setChangedNamae] = useState('');
    const [changedNenrei, setChangedNenrei] = useState('');
    const [nenrei, setNenrei] = useState('');
    const params = useParams();
    const namae = params.namae;

    const url = "http://127.0.0.1:8000/";

    useEffect(() => {
        console.log("params");
        console.log(params.namae);
        axios
            .get(url + "kyaku/" + namae)
            .then((response) => {
                if (response.data["result"] === "success") {
                    console.log(response.data["data"]);
                    setNenrei(response.data["data"]["nenrei"]);//画面をリロード
                } else {
                    navigate("/error");
                }
            })
            .catch((response) => {
                console.log(response.data);
                console.log("error");
            });
    }, []);

    const handleChange = async () => {
        console.log({ changedNamae, changedNenrei });
        console.log(url + "kousin/" + changedNamae);
        axios
            .post(
                url + "kousin/" + changedNamae,
                {
                    "namae": changedNamae,
                    "nenrei": changedNenrei,
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
    return (
        <div>
            <VStack>
                <VStack marginBottom={8}>
                    <Text fontSize={"xl"}>名前</Text>
                    <Text fontSize={"3xl"}>{params.namae}</Text>
                    <Box>
                    </Box>
                    <Text fontSize={"3xl"}>年齢</Text>
                    <Text fontSize={"3xl"}>{nenrei}</Text>
                </VStack>
                <Box>
                    <Text fontSize={"3xl"}>客情報を変更する</Text>
                    <FormControl>
                        <FormLabel htmlFor="name">名前</FormLabel>
                        <Input
                            id="namae"
                            placeholder="namae"
                            value={namae}
                            onChange={(e) => setChangedNamae(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                            id="nenrei"
                            placeholder="nenrei"
                            type="name"
                            value={nenrei}//最初の値を設定
                            onChange={(e) => setChangedNenrei(e.target.value)}
                        />
                    </FormControl>

                    <Button mt={4} colorScheme="blue" type="submit" onClick={handleChange}>
                        変更
                    </Button>
                </Box>
            </VStack>
        </div>
    )
}

export default Change