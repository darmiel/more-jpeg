import { PropsWithChildren, createContext, useContext, useState } from "react"

const SearchContext = createContext({
  search: "",
  setSearch: (search: string) => {},
})

export function useSearch() {
  return useContext(SearchContext)
}

export function SearchProvider({ children }: PropsWithChildren) {
  const [search, setSearch] = useState("")

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  )
}
