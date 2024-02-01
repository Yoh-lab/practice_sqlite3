import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Box, Button, FormControl, FormLabel, Input, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

type KyakuDataProps = {
    namae: string;
    nenrei: number;
};

const Change = (prop: KyakuDataProps) => {
    const navigate = useNavigate();
    const [changedNamae, setChangedNamae] = useState('');
    const [changedNenrei, setChangedNenrei] = useState('');
    const namae = prop.namae;
    const nenrei = prop.nenrei;

    const url = "http://127.0.0.1:8000/";

    useEffect(() => {
        axios
            .get(url + "kyaku/" + namae)
            .then((response) => {
                console.log(response.data.result);
                // console.log(response.data[0]["image_url"]);
            })
            .catch((response) => {
                console.log(response.data);
                console.log("error");
            });
    }, []);

    const handleChange = async () => {
        console.log({ namae, nenrei });
        console.log(url + "kousin/" + namae);
        axios
            .post(
                url + "kousin/" + namae,
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
                    <Text fontSize={"3xl"}>名前</Text>
                    <Box>
                    </Box>
                    <Text fontSize={"3xl"}>年齢</Text>
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