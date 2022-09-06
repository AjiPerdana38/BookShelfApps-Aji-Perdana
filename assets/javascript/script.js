//Deklarasi Array Untuk Menyimpan data
const books = []

// menginialisasi localStorage
const STORAGE_KEY = 'BOOKS_SHELF_APPS'

// Event custom Saved books
const SAVED_EVENT = 'Save-Books'

// deklarasi event custom untuk render data
const RENDER_EVENT = 'Bookshelf-apps'

// Check Local Storage Pada Browser
const isStorageExist = () => {
    if(typeof(Storage) === 'undefined'){
        alert('Browser Anda Tidak Mendukung Web Storage')
        return false
    }
    return true
}

document.addEventListener(SAVED_EVENT, () => {
    const panjangarray = localStorage.getItem(STORAGE_KEY)
    const jumlahData = JSON.parse(panjangarray)

    console.log(jumlahData.length)
})

// function load data from storage
const loadDataFromStorage = () => {
    const serializeData = localStorage.getItem(STORAGE_KEY)
    let data = JSON.parse(serializeData)

    if(data !== null) {
        for(const book of data){
            books.push(book)
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT))
}

// Function Generate ID
const generatedID = () => {
    return +new Date()
}

// Function generate value to object
const generateBooksObject = (id, title, author, years, cover, isCompleted) => {
    return{
        id,
        title,
        author,
        years,
        cover,
        isCompleted
    }
}

// function save data
const saveData = () => {
    if(isStorageExist()){
        const parsed = JSON.stringify(books)
        localStorage.setItem(STORAGE_KEY, parsed)
        document.dispatchEvent(new Event(SAVED_EVENT))
    }
}

// isCompleted check
const isCompleted = document.getElementById('isBooksCompleted')
isCompleted.addEventListener('change', ()=>{
    const completed = document.getElementById('completed')
    if(isCompleted.checked){
        completed.innerText = 'Sudah Selesai Dibaca'
    }else{
        completed.innerText = 'Belum Selesai Dibaca'
    }
})

const checked = () => {
    if(isCompleted.checked){
        return true
    }
    return false
}

// function findBooks
const findBooks = (booksID) => {
    for(const buku of books){
        if(buku.id == booksID){
            return buku
        }
    }
    return null
}

// function findIndex Books
const findBooksIndex = (booksID) => {
    for(const index in books){
        if(books[index].id == booksID){
            return index
        }
    }
    return -1
}

// Function Book Add
const bookadd = () => {
    const id = generatedID()
    const title = document.getElementById('booksTitle').value
    const author = document.getElementById('booksAuthor').value
    const years = document.getElementById('booksYear').value
    const cover = document.getElementById('booksCover').value
    const isCompleted = checked()

    const objectBooks =  generateBooksObject(id, title, author, years, cover, isCompleted)
    books.unshift(objectBooks)

    document.dispatchEvent(new Event(RENDER_EVENT))
    showToatSubmitNotif(title)
    saveData()
}

//function remove books by index
const removeBooksByID = (booksID) => {
    const booksTarget = findBooksIndex(booksID)

    if(booksTarget == -1) return

    books.splice(booksTarget, 1)

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

// function addBooksToCompleteShelf
const addBooksToComplete = (booksID) => {
    const booksTarget = findBooks(booksID)

    if(booksTarget == null) return

    booksTarget.isCompleted = true

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

// function undoBooksFromCompleteShelf
const undoBooksFromComplete = (booksID) => {
    const booksTarget = findBooks(booksID)

    if(booksTarget == null) return

    booksTarget.isCompleted = false

    document.dispatchEvent(new Event(RENDER_EVENT))
    saveData()
}

// function editBooks
const editBooks = (booksID) => {
    // menampilkan halaman edit data buku
    const formEdit = document.querySelector('.editBook')
    formEdit.style.display = 'flex'

    // mencari data buku berdasarkan ID
    const booksTarget = findBooksIndex(booksID)

    // mendapatkan data lama buku
    const title = document.getElementById('booksTitleEdit')
    title.setAttribute('value', books[booksTarget].title)

    const author = document.getElementById('booksAuthorEdit')
    author.setAttribute('value', books[booksTarget].author)

    const year = document.getElementById('booksYearEdit')
    year.setAttribute('value', books[booksTarget].years)

    const cover = document.getElementById('booksCoverEdit')
    cover.setAttribute('value', books[booksTarget].cover)

    // update data
    const submitEdit = document.getElementById('editBooksForm')
    submitEdit.addEventListener('submit', () => {

        books[booksTarget].title = title.value
        books[booksTarget].author = author.value
        books[booksTarget].years = year.value
        books[booksTarget].cover = cover.value

        document.dispatchEvent(new Event(RENDER_EVENT))
        saveData()
        formEdit.style.display = 'none'
    })

    // Event menekan tombol batalkan edit
    const unDisplay = document.getElementById('batalUpdate')
    unDisplay.addEventListener('click', (event)=> {
        event.preventDefault()

        formEdit.style.display = 'none'
    })
}

// function makeBooks
const makeBooks = (booksObject) => {
    const cover = document.createElement('img')
    cover.classList.add('booksCover')
    cover.setAttribute('src', `${booksObject.cover}`)

    const title = document.createElement('h3')
    title.innerText = booksObject.title

    const author = document.createElement('p')
    author.innerText = booksObject.author

    const years = document.createElement('p')
    years.innerText = booksObject.years

    const edit = document.createElement('button')
    edit.innerText = 'Edit'
    edit.classList.add('btnEditFromList')
    edit.style.cursor = 'pointer'
    edit.addEventListener('click', () => {
        editBooks(booksObject.id)
    })

    const infoBooks = document.createElement('div')
    infoBooks.classList.add('infoBooks')
    infoBooks.append(title, author, years, edit)

    const container = document.createElement('article')
    container.classList.add('innerData')
    container.append(cover, infoBooks)

    const trashButton = document.createElement('button')
    trashButton.classList.add('trashButton')
    trashButton.style.cursor = 'pointer'
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>'
    trashButton.addEventListener('click', () => {
        const isConfirm = confirm(`Apakah Kamu Mau Menghapus Buku ${booksObject.title} Dari Keranjang?`)
        if(isConfirm){
            removeBooksByID(booksObject.id)
            showToatDeleteNotif()
        }
    })

    const action = document.createElement('div')
    action.classList.add('actionButton')

    if(booksObject.isCompleted){
        const undoButton = document.createElement('button')
        undoButton.classList.add('undoButton')
        undoButton.style.cursor = 'pointer'
        undoButton.innerHTML = '<i class="fa-solid fa-rotate-left"></i>'
        undoButton.addEventListener('click', () => {
            undoBooksFromComplete(booksObject.id)
        })
        action.append(undoButton, trashButton)
        container.append(action)
    } else {
        const checkButton = document.createElement('button')
        checkButton.classList.add('checkButton')
        checkButton.style.cursor = 'pointer'
        checkButton.innerHTML = '<i class="fa-solid fa-check"></i>'
        checkButton.addEventListener('click', () => {
            addBooksToComplete(booksObject.id)
        })
        action.append(checkButton, trashButton)
        container.append(action)
    }

    return container
}

// function hapus seluruh data buku
const destroyAllBooksData = () => {
    if(books == 0){
        alert('Data Buku Kosong')
    }else{
        const isConfirm = confirm("Apakah Kamu Ingin Menghapus Seluruh Data Buku?")
        if(isConfirm){
            books.splice(0, books.length)
            document.dispatchEvent(new Event(RENDER_EVENT))
            showToatDeleteAllNotif()
            saveData()
        }
    }
}

// function toat submit book notif
const showToatSubmitNotif = (booksTitle) => {
    const toatElement = document.getElementById('toat-submit')
    toatElement.classList.add('display')

    const title = document.getElementById('title-submit-toat')
    title.innerText = booksTitle

    setTimeout(() => {
        toatElement.classList.remove('display')
    }, 3000)
}

// function toat delete book notif
const showToatDeleteNotif = () => {
    const toatElement = document.getElementById('toat-delete')
    toatElement.classList.add('display')

    setTimeout(() => {
        toatElement.classList.remove('display')
    }, 3000)
}

// function toat delete all books notif
const showToatDeleteAllNotif = () => {
    const toatElement = document.getElementById('toat-deleteAll')
    toatElement.classList.add('display')

    setTimeout(() => {
        toatElement.classList.remove('display')
    }, 3000)
}

// function searchbooks
const searchBook = () => {
    const title = document.getElementById('searchBookTitle').value
    const containerSearchBooks = document.querySelector('#searchBook>.innerBookshelf')
    containerSearchBooks.innerHTML = ''

    if (title === "") {
        document.dispatchEvent(new Event(RENDER_EVENT));
        return;
    }

    for(const book of books){
        const booksElement = makeBooks(book)
        if(book.title.toLowerCase().includes(title.toLowerCase())){
            if(book.isCompleted){
                containerSearchBooks.append(booksElement)
            }

            if(!book.isCompleted){
                containerSearchBooks.append(booksElement)
            }
        }
    }
}

// event loadDOM
document.addEventListener('DOMContentLoaded', () => {
    const submit = document.getElementById('submit-books')
    submit.addEventListener('submit', (event) => {
        event.preventDefault()

        bookadd()
    })

    const searchBooks = document.getElementById('searchBook')
    searchBooks.addEventListener('keyup', (event) => {
        event.preventDefault()

        searchBook()
    })

    searchBooks.addEventListener('submit', (event) => {
        event.preventDefault()

        searchBook()
    })

    const removeAllBooksData = document.getElementById('removeBooksData')
    removeAllBooksData.addEventListener('click', () => {
        destroyAllBooksData()
    })

    if(isStorageExist()){
        loadDataFromStorage()
    }
})

// event render data into UI
document.addEventListener(RENDER_EVENT, () => {
    const unCompletedBooks = document.getElementById('uncompleted-books')
    unCompletedBooks.innerHTML = ''

    const completedBooks = document.getElementById('completed-books')
    completedBooks.innerHTML = ''

    for(const booksList of books){
        const booksElement = makeBooks(booksList)

        if(!booksList.isCompleted){
            unCompletedBooks.append(booksElement)
        }else{
            completedBooks.append(booksElement)
        }
    }
})