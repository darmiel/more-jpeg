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
          <ModalHeader>Import Recipe</ModalHeader>
          <ModalBody>
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
