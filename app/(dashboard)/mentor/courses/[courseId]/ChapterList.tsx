"use client"

import { Chapter } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { DragDropContext, Draggable, DropResult, Droppable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'
import { Grip, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface props {
    onEdit: (id: string) => void // current edit chapter id
    onReorder: (updateData: { id: string, position: number }[]) => void // finalize the chapter(s) position before update to db
    items: Chapter[] // total chapters from current course
}

const ChapterList = ({ items, onEdit, onReorder }: props) => {
    const [isMounted, setIsMounted] = useState(false);
    const [chapters, setChapters] = useState(items);

    useEffect(() => {
        setChapters(items)
    }, [items])

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) return null

    // import from dnd
    // Paste it to chatgpt for further explanation
    // dnd the chapters and without back to initial position, but refresh it will
    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return;

        const items = Array.from(chapters); // make it array form
        const [rePositionItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, rePositionItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedChapters = items.slice(startIndex, endIndex + 1);

        // Store the latest chapters' position
        setChapters(items)

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }))

        // update the latest position to db
        onReorder(bulkUpdateData);
    }
  
    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            <Droppable droppableId='chapters'>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {chapters.map((chapter, index) => (
                            <Draggable
                                key={chapter.id}
                                draggableId={chapter.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps} 
                                        ref={provided.innerRef}
                                        className={cn(`flex items-center gap-x-2 bg-white border-green-400 border text-slate-700 rounded-md mb-4 text0-sm`, chapter.isPublished && 'bg-sky-100 border-sky-200 text-sky-700')}
                                    >
                                        <div 
                                            {...provided.dragHandleProps}
                                            className={cn(`px-2 py-3 border-r border-r-green-300 hover:bg-green-400 rounded-l-sm transition`, chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200')}
                                        >
                                            <Grip className='h-5 w-5 text-neutral-700'/>
                                        </div>
                                        {chapter.title}

                                        <div className='ml-auto pr-2 flex items-center gap-x-2'>
                                            {chapter.isFree && (
                                                <>
                                                    <Badge className='bg-green-400'>
                                                        Free
                                                    </Badge>
                                                </>
                                            )}

                                            <Pencil
                                                onClick={() => onEdit(chapter.id)}
                                                className='w-4 h-4 hover:opacity-75 transition-all cursor-pointer'/>
                                            <Badge className={cn(`bg-slate-500`, chapter.isPublished && 'bg-green-500')}>
                                                {chapter.isPublished ? "Published" : "Draft"}
                                            </Badge>
                                            
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}

                        {/* fix the component size during drag & drop */}
                        {provided.placeholder} 
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default ChapterList