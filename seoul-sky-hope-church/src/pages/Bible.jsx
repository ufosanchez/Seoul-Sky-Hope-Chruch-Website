import { useState, useEffect } from "react";

export default function Bible(){
    const [books, setBooks] = useState([])
    const [chapters, setChapters] = useState([])
    const [verses, setVerses] = useState("")

    const [selectedBook, setSelectedBook] = useState("GEN")
    const [selectedChapter, setSelectedChapter] = useState("GEN.1")

    useEffect(() => {
        const getBooks = async () => {
            let response = await fetch(
                "https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/books",
                {
                    method: "get",
                    headers: {
                        'accept': 'application/json',
                        'api-key': '74ae4148698129094437eed8b6f85523'
                      }
                }
            );
            let data = await response.json();
            console.log(data);
            setBooks(data.data)
        }
        getBooks();
    }, [])

    useEffect(() => {
        if (selectedBook) {
            const getChapters = async () => {
                let response = await fetch(
                    `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/books/${selectedBook}/chapters`,
                    {
                        method: "get",
                        headers: {
                            'accept': 'application/json',
                            'api-key': '74ae4148698129094437eed8b6f85523'
                        }
                    }
                );
                let data = await response.json();
                console.log(data);
                setChapters(data.data);
            }
            getChapters();
        }
    }, [selectedBook]);

    useEffect(() => {
        if (selectedChapter) {
            const getVerses = async () => {
                let response = await fetch(
                    `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-02/chapters/${selectedChapter}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`,
                    {
                        method: "get",
                        headers: {
                            'accept': 'application/json',
                            'api-key': '74ae4148698129094437eed8b6f85523'
                        }
                    }
                );
                let data = await response.json();
                console.log(data);
                setVerses(data.data);
            }
            getVerses();
        }
    }, [selectedBook, selectedChapter]);

    function formatVerses(content) {

        const parts = content.split('¶ ');

        const formattedContent = parts.join("");

        return formattedContent;
    }

    /* const formattedVerses = verses.content ? formatVerses(verses.content) : "";

    const a = verses.content.replace(/\n/g, '<br>'); */

    /* function formatVerses(content) {
        let a = content.split("\n")

        let b = a.join("<br/>")

        return b
    }

    const formattedVerses = verses.content ? formatVerses(verses.content) : ""; */

    return(
        <div className="max-w-[600px] mx-auto px-4 py-12">
            <label htmlFor="books" className="pr-2">Books:</label>
            <select name="books" id="books" onChange={(e) => setSelectedBook(e.target.value)} className="rounded-[10px] border-2 border-[#808080]">
            {
                books.map((book) => (
                    <option value={book.id} key={book.name}>{book.name}</option>
                ))
            }
            </select>  

            <label htmlFor="chapters" className="px-2">Chapter:</label>
            <select name="chapters" id="chapters" onChange={(e) => setSelectedChapter(e.target.value)} className="rounded-[10px] border-2 border-[#808080]">
            {
                chapters.map((chapter) => (
                    <option value={chapter.id} key={chapter.id}>{chapter.number}</option>
                ))
            }
            </select> 
            
            {/* <div dangerouslySetInnerHTML={{ __html: formattedVerses }} /> */}
            {/* <p>{verses.content}</p> */}
            <h1 className="font-[Montserrat] font-bold text-5xl text-center py-8">{verses.reference}</h1>
            { verses.content && (
                <div className="text-2xl font-[Inter]" dangerouslySetInnerHTML={{ __html: formatVerses(verses.content) }} />
            )} 
            
        </div>
    );
}