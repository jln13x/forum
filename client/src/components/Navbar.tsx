import { Box, Button, Flex, Link, StackItem, HStack } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  // data is loading
  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );

    // user is logged in
  } else {
    body = (
      <HStack>
        <StackItem>
          <Box>{data.me.username}</Box>
        </StackItem>
        <StackItem>
          <Button
            isLoading={logoutFetching}
            onClick={() => logout()}
            variant="link"
            mr={1}
          >
            Logout
          </Button>
        </StackItem>
      </HStack>
    );
  }

  return (
    <Flex bg="tomato">
      <Box bg="tomato" p={4} ml={"auto"}>
        {body}
      </Box>
    </Flex>
  );
};

export default withUrqlClient(createUrqlClient)(Navbar);
