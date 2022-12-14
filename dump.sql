PGDMP     ;                	    z            shortly #   14.5 (Ubuntu 14.5-0ubuntu0.22.04.1) #   14.5 (Ubuntu 14.5-0ubuntu0.22.04.1)     7           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            8           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            9           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            :           1262    16703    shortly    DATABASE     \   CREATE DATABASE shortly WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.UTF-8';
    DROP DATABASE shortly;
                postgres    false            ?            1259    16727    sessions    TABLE     ?   CREATE TABLE public.sessions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token text NOT NULL,
    "lastStatus" bigint NOT NULL
);
    DROP TABLE public.sessions;
       public         heap    postgres    false            ?            1259    16726    sessions_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.sessions_id_seq;
       public          postgres    false    212            ;           0    0    sessions_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;
          public          postgres    false    211            ?            1259    16745 
   shorteneds    TABLE     ?   CREATE TABLE public.shorteneds (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    url text NOT NULL,
    "visitCount" integer NOT NULL,
    "shortUrl" text NOT NULL
);
    DROP TABLE public.shorteneds;
       public         heap    postgres    false            ?            1259    16744    shorteneds_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.shorteneds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.shorteneds_id_seq;
       public          postgres    false    214            <           0    0    shorteneds_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.shorteneds_id_seq OWNED BY public.shorteneds.id;
          public          postgres    false    213            ?            1259    16716    users    TABLE     ?   CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(25) NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "linkCount" integer NOT NULL,
    "visitCount" integer NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            ?            1259    16715    users_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    210            =           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    209            ?           2604    16730    sessions id    DEFAULT     j   ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);
 :   ALTER TABLE public.sessions ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    211    212            ?           2604    16748    shorteneds id    DEFAULT     n   ALTER TABLE ONLY public.shorteneds ALTER COLUMN id SET DEFAULT nextval('public.shorteneds_id_seq'::regclass);
 <   ALTER TABLE public.shorteneds ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    213    214    214            ?           2604    16719    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    209    210    210            2          0    16727    sessions 
   TABLE DATA           E   COPY public.sessions (id, "userId", token, "lastStatus") FROM stdin;
    public          postgres    false    212   ?!       4          0    16745 
   shorteneds 
   TABLE DATA           Q   COPY public.shorteneds (id, "userId", url, "visitCount", "shortUrl") FROM stdin;
    public          postgres    false    214   G"       0          0    16716    users 
   TABLE DATA           Y   COPY public.users (id, username, email, password, "linkCount", "visitCount") FROM stdin;
    public          postgres    false    210   ?"       >           0    0    sessions_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.sessions_id_seq', 1, true);
          public          postgres    false    211            ?           0    0    shorteneds_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.shorteneds_id_seq', 1, true);
          public          postgres    false    213            @           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 6, true);
          public          postgres    false    209            ?           2606    16734    sessions sessions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public            postgres    false    212            ?           2606    16736    sessions sessions_token_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_token_key UNIQUE (token);
 E   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_token_key;
       public            postgres    false    212            ?           2606    16752    shorteneds shorteneds_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.shorteneds
    ADD CONSTRAINT shorteneds_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.shorteneds DROP CONSTRAINT shorteneds_pkey;
       public            postgres    false    214            ?           2606    24953 "   shorteneds shorteneds_shortUrl_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.shorteneds
    ADD CONSTRAINT "shorteneds_shortUrl_key" UNIQUE ("shortUrl");
 N   ALTER TABLE ONLY public.shorteneds DROP CONSTRAINT "shorteneds_shortUrl_key";
       public            postgres    false    214            ?           2606    16743    users unique_username 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_username;
       public            postgres    false    210            ?           2606    16725    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    210            ?           2606    16723    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    210            ?           2606    16737    sessions sessions_userId_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);
 I   ALTER TABLE ONLY public.sessions DROP CONSTRAINT "sessions_userId_fkey";
       public          postgres    false    212    3225    210            ?           2606    16753 !   shorteneds shorteneds_userId_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.shorteneds
    ADD CONSTRAINT "shorteneds_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);
 M   ALTER TABLE ONLY public.shorteneds DROP CONSTRAINT "shorteneds_userId_fkey";
       public          postgres    false    3225    214    210            2   >   x?ʱ?0?v!??I?????g??G?qWG???Bw??=9d?,????????@      4   9   x?3?4?,//?K??O?I?K???44?L?v-3*Hwq(/NMηLI?????? wv?      0   ?   x?eͻ?0 ???;?k??YM$Q@+ڈq???<??׻???????d??݄eQ?e?U>?af%w_?G????it???????^n???xk{??v?p}X?k @?"?U??XU4??ʏ?K'???$??ݫ5.C?v????_&?"
????E?(P?n!?S=?     