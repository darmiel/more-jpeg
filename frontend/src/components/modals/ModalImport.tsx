import Warning from "@/components/ui/Warning"
import { Recipe } from "@/util/recipe"
import {
  Button,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react"
import { useState } from "react"
import { FaFileImport } from "react-icons/fa6"

export default function ModalImport({
  onImport,
}: {
  onImport: (recipe: Recipe) => void
}) {
  const [content, setContent] = useState("")

  return (
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader className="items-center space-x-2">
            <FaFileImport />
            <span>Import Recipe</span>
          </ModalHeader>
          <ModalBody>
            <Warning warning="The site might break if data is invalid" />
            <Textarea
              variant="bordered"
              value={content}
              onValueChange={setContent}
              minRows={3}
              maxRows={20}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              color="primary"
              onClick={() => {
                onImport(JSON.parse(content) as Recipe)
                onClose()
              }}
            >
              Import
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  )
}
