import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Select,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({ variables });

  return (
    <Layout>
      <Flex justifyContent="flex-end">
        <NextLink href="/create-post">
          <Button colorScheme="teal">New Post</Button>
        </NextLink>
      </Flex>
      {!data && fetching ? (
        <Center mt={8}>
          <Spinner size="lg" />
        </Center>
      ) : (
        <Box>
          <Stack spacing={8} my={4}>
            {data?.posts.map((post) => (
              <Box
                key={post.id}
                p={5}
                shadow="dark-lg"
                bgColor=""
                rounded="10px"
              >
                <Heading fontSize="lg">{post.title}</Heading>
                <Text>{post.textSnippet}</Text>
              </Box>
            ))}
          </Stack>

          <Flex>
            <Button
              isLoading={fetching}
              m="auto"
              my={8}
              variant="solid"
              colorScheme="teal"
              onClick={() =>
                setVariables({
                  limit: variables.limit,
                  cursor: data?.posts[data.posts.length - 1].createdAt,
                })
              }
            >
              Load more
            </Button>
          </Flex>
        </Box>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
