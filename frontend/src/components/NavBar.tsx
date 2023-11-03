"use client"

import { useSearch } from "@/context/SearchContext"
import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  Tooltip,
} from "@nextui-org/react"
import Link from "next/link"
import { FaGithub, FaMagnifyingGlass } from "react-icons/fa6"

export default function NavBar() {
  const { search, setSearch } = useSearch()
  return (
    <Navbar isBordered>
      <NavbarBrand className="space-x-1">
        <span className="text-blue-500">even-more</span>
        <h1 className="hidden text-2xl font-bold sm:block">JPEG</h1>
      </NavbarBrand>
      <NavbarContent as="div" className="items-center" justify="end">
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Search Recipe..."
          size="sm"
          startContent={<FaMagnifyingGlass size={18} />}
          type="search"
          value={search}
          onValueChange={setSearch}
        />
        <Tooltip content="Contribute">
          <Link
            href="https://github.com/darmiel/more-jpeg"
            target="_blank"
            className="text-2xl text-white"
          >
            <FaGithub />
          </Link>
        </Tooltip>
      </NavbarContent>
    </Navbar>
  )
}
